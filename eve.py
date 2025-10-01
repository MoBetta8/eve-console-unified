import os
import sys
import time
import platform
import subprocess
import threading
import json
import urllib.request
from pathlib import Path

import numpy as np
import sounddevice as sd
import webrtcvad
from pynput import keyboard
from faster_whisper import WhisperModel

# =========================
# 🔧 CONFIG (fill key later in Step 2)
# =========================
OPENROUTER_API_KEY = "sk-or-PASTE-YOUR-KEY-LATER"
OPENROUTER_MODEL  = "deepseek/deepseek-r1"
OPENROUTER_BASE   = "https://openrouter.ai/api/v1"

MIC_INDEX   = None          # None = default mic; or set a number if needed later
SAMPLE_RATE = 16000
CHANNELS    = 1

ROOT     = Path(r"C:\Eve")
DATA_DIR = ROOT / "data"
VOICES   = DATA_DIR / "voices"
TMP_DIR  = DATA_DIR / "tmp"
for p in [DATA_DIR, VOICES, TMP_DIR]:
    p.mkdir(parents=True, exist_ok=True)

# Piper voice model (we’ll download it in Step 2)
PIPER_MODEL = str(VOICES / "en_US-lessac-medium.onnx")

# Wake word + capture
WAKE_WORD            = "eve"
WAKE_LISTEN_MS       = 1200    # tiny listen windows to catch "Eve"
VAD_FRAME_MS         = 30
VAD_AGGRESSIVENESS   = 2       # 0..3
SILENCE_TIMEOUT_S    = 1.2     # stop after ~1.2s silence
MAX_COMMAND_SECONDS  = 15

# =========================
# 🧠 LLM via OpenRouter
# =========================
def llm_chat(prompt: str) -> str:
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are Eve, a helpful, concise voice assistant."},
            {"role": "user", "content": prompt}
        ]
    }
    req = urllib.request.Request(
        url=f"{OPENROUTER_BASE}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "local-eve",
            "X-Title": "Eve Voice"
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read().decode("utf-8"))
            return resp["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Sorry, my brain hit a snag: {e}"

# =========================
# 🔊 TTS: Piper (offline)
# =========================
def speak_tts(text: str, out_path=str(TMP_DIR / "reply.wav")):
    txt_path = TMP_DIR / "reply.txt"
    txt_path.parent.mkdir(parents=True, exist_ok=True)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)

    try:
        subprocess.run(
            ["piper", "--model", PIPER_MODEL, "--output_file", out_path, "--text_file", str(txt_path)],
            check=True
        )
    except FileNotFoundError:
        print("⚠️ Piper not found. We’ll install it in Step 2.")
        return
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Piper TTS failed: {e}")
        return

    # Play sound (OS-specific)
    if platform.system() == "Windows":
        os.startfile(out_path)  # type: ignore[attr-defined]
    elif platform.system() == "Darwin":
        subprocess.Popen(["afplay", out_path])
    else:
        subprocess.Popen(["xdg-open", out_path])

# =========================
# 🎤 Audio helpers
# =========================
def _int16_audio(data: np.ndarray) -> np.ndarray:
    if data.ndim > 1:
        data = data[:, 0]
    data = np.clip(data, -1.0, 1.0)
    return (data * 32767).astype(np.int16)

def record_ms(ms: int) -> np.ndarray:
    frames = int(SAMPLE_RATE * ms / 1000)
    audio = sd.rec(frames, samplerate=SAMPLE_RATE, channels=CHANNELS, dtype='float32', device=MIC_INDEX)
    sd.wait()
    return _int16_audio(audio)

# =========================
# 🗣️ Offline STT: faster-whisper
# =========================
_whisper = None
def stt_init():
    global _whisper
    if _whisper is None:
        _whisper = WhisperModel("base.en", device="cpu", compute_type="int8")

def stt_transcribe_pcm16(pcm16: np.ndarray) -> str:
    stt_init()
    audio = pcm16.astype(np.float32) / 32768.0
    segments, info = _whisper.transcribe(audio, language="en", vad_filter=True)
    text = "".join(s.text for s in segments).strip()
    return text

def stt_transcribe_ms(ms: int) -> str:
    pcm16 = record_ms(ms)
    return stt_transcribe_pcm16(pcm16)

# =========================
# 👂 VAD-based command capture
# =========================
class CommandRecorder:
    def __init__(self, aggressiveness=VAD_AGGRESSIVENESS):
        self.vad = webrtcvad.Vad(aggressiveness)

    def record_utterance(self) -> np.ndarray:
        frame_len = int(SAMPLE_RATE * VAD_FRAME_MS / 1000)
        collected = []
        speech_started = False
        last_voice = None
        start = time.time()

        while True:
            audio = sd.rec(frame_len, samplerate=SAMPLE_RATE, channels=CHANNELS, dtype='float32', device=MIC_INDEX)
            sd.wait()
            pcm = _int16_audio(audio)
            is_voice = self.vad.is_speech(pcm.tobytes(), SAMPLE_RATE)

            if is_voice:
                speech_started = True
                last_voice = time.time()
                collected.append(pcm)
            else:
                if speech_started:
                    collected.append(pcm)

            now = time.time()
            if speech_started and last_voice and (now - last_voice > SILENCE_TIMEOUT_S):
                break
            if now - start > MAX_COMMAND_SECONDS:
                break

        if not collected:
            return np.array([], dtype=np.int16)
        return np.concatenate(collected)

# =========================
# ⌨️ Optional push-to-talk (F9)
# =========================
PUSH_TO_TALK_KEY = keyboard.Key.f9
pressing = threading.Event()

def _on_press(key):
    if key == PUSH_TO_TALK_KEY:
        pressing.set()

def _on_release(key):
    if key == PUSH_TO_TALK_KEY:
        pressing.clear()

def start_hotkey_listener():
    listener = keyboard.Listener(on_press=_on_press, on_release=_on_release)
    listener.daemon = True
    listener.start()

# =========================
# 🚀 Main
# =========================
def main():
    print("Eve online. Say 'Eve' (pause) then speak. Or hold F9 to talk.")
    start_hotkey_listener()
    cmdrec = CommandRecorder()

    while True:
        try:
            # Wake mini-listen
            wake_text = stt_transcribe_ms(WAKE_LISTEN_MS).lower()
            if (WAKE_WORD in wake_text) or pressing.is_set():
                speak_tts("Hey, what's up? What can I do for you?")
                pcm = cmdrec.record_utterance()
                if pcm.size == 0:
                    speak_tts("I didn't catch that. Try again.")
                    continue
                command = stt_transcribe_pcm16(pcm).strip()
                if not command:
                    speak_tts("I didn't catch that. Try again.")
                    continue

                reply = llm_chat(command)
                print(f"You: {command}\nEve: {reply}\n")
                speak_tts(reply)
        except KeyboardInterrupt:
            print("\nBye!")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(0.5)

if __name__ == "__main__":
    main()# Eve v3 — Wake word "Eve" -> greet -> hear command -> think -> speak
# - Offline STT: faster-whisper  (no quotas)
# - Offline TTS: pyttsx3         (no quotas)
# - Brain: OpenRouter DeepSeek R1 (reads key from C:\Eve\.env)
# Copy-paste only. No edits needed.

import os
import time
import json
import platform
import subprocess
import urllib.request
from pathlib import Path
from datetime import datetime

import numpy as np
import sounddevice as sd
from faster_whisper import WhisperModel
import pyttsx3

# =========================
# Paths & folders
# =========================
ROOT     = Path(r"C:\Eve")
DATA_DIR = ROOT / "data"
TMP_DIR  = DATA_DIR / "tmp"
for p in (DATA_DIR, TMP_DIR):
    p.mkdir(parents=True, exist_ok=True)

# =========================
# Config
# =========================
WAKE_WORD            = "eve"
WAKE_LISTEN_MS       = 1400        # you say "Eve", pause ~1 sec
SAMPLE_RATE          = 16000
CHANNELS             = 1
FRAME_MS             = 200
SILENCE_TIMEOUT_S    = 1.2
MAX_COMMAND_SECONDS  = 15
MIC_INDEX            = None        # default mic; set a number later if needed

# STT model size: tiny.en (fast) | base.en (balanced) | small.en (better)
WHISPER_SIZE = "base.en"

# OpenRouter (reads key from C:\Eve\.env; we’ll add it next step)
ENV_PATH = ROOT / ".env"
OPENROUTER_API_KEY = ""
if ENV_PATH.exists():
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENROUTER_API_KEY="):
            OPENROUTER_API_KEY = line.split("=", 1)[1].strip()

OPENROUTER_MODEL = "deepseek/deepseek-r1"
OPENROUTER_BASE  = "https://openrouter.ai/api/v1"

# =========================
# Text-to-speech (offline)
# =========================
_tts = pyttsx3.init()
def speak(text: str):
    try:
        _tts.say(text)
        _tts.runAndWait()
    except Exception as e:
        print(f"[TTS] {e}")

# =========================
# Speech-to-text (offline)
# =========================
_whisper = None
def stt_init():
    global _whisper
    if _whisper is None:
        _whisper = WhisperModel(WHISPER_SIZE, device="cpu", compute_type="int8")

def _to_int16(f32: np.ndarray) -> np.ndarray:
    if f32.ndim > 1:
        f32 = f32[:, 0]
    f32 = np.clip(f32, -1.0, 1.0)
    return (f32 * 32767).astype(np.int16)

def record_ms(ms: int) -> np.ndarray:
    frames = int(SAMPLE_RATE * ms / 1000)
    data = sd.rec(frames, samplerate=SAMPLE_RATE, channels=CHANNELS, dtype="float32", device=MIC_INDEX)
    sd.wait()
    return _to_int16(data)

def transcribe_pcm16(pcm16: np.ndarray) -> str:
    stt_init()
    audio = pcm16.astype(np.float32) / 32768.0
    segments, _info = _whisper.transcribe(audio, language="en", vad_filter=True)
    return "".join(s.text for s in segments).strip()

def transcribe_ms(ms: int) -> str:
    return transcribe_pcm16(record_ms(ms))

def calibrate_noise(seconds: float = 0.8) -> float:
    pcm = record_ms(int(seconds * 1000))
    return float(np.sqrt(np.mean((pcm.astype(np.float32))**2))) or 200.0

def record_until_silence(max_seconds=MAX_COMMAND_SECONDS, silence_timeout=SILENCE_TIMEOUT_S,
                         frame_ms=FRAME_MS, voice_boost=3.0, noise_add=300.0) -> np.ndarray:
    baseline = calibrate_noise()
    threshold = baseline * voice_boost + noise_add
    collected = []
    start = time.time()
    last_voice = start

    while True:
        frames = int(SAMPLE_RATE * frame_ms / 1000)
        buf = sd.rec(frames, samplerate=SAMPLE_RATE, channels=CHANNELS, dtype="float32", device=MIC_INDEX)
        sd.wait()
        pcm = _to_int16(buf)
        collected.append(pcm)

        rms = float(np.sqrt(np.mean((pcm.astype(np.float32))**2)))
        now = time.time()
        if rms > threshold:
            last_voice = now

        if now - last_voice > silence_timeout:
            break
        if now - start > max_seconds:
            break

    if not collected:
        return np.array([], dtype=np.int16)
    return np.concatenate(collected)

# =========================
# LLM via OpenRouter (DeepSeek)
# =========================
def llm_chat(prompt: str) -> str:
    if not OPENROUTER_API_KEY:
        return "I need your OpenRouter API key before I can think. We’ll add it next."
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": "You are Eve, a concise, friendly voice assistant for Lucas. Keep answers tight and helpful."},
            {"role": "user", "content": prompt}
        ]
    }
    req = urllib.request.Request(
        url=f"{OPENROUTER_BASE}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "local-eve",
            "X-Title": "Eve Voice"
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read().decode("utf-8"))
            return resp["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Brain error: {e}"

# =========================
# Main
# =========================
def main():
    print("Eve online. Say 'Eve' … pause … then speak. (Faster on second run after STT downloads.)")
    while True:
        try:
            wake_text = transcribe_ms(WAKE_LISTEN_MS).lower()
            if WAKE_WORD not in wake_text:
                time.sleep(0.3)  # idle so CPU doesn’t spike
                continue

            # Wake response (your exact line)
            speak("Hey, what's up? What can I do for you?")

            # Capture your command until silence
            pcm = record_until_silence()
            if pcm.size == 0:
                speak("I didn't catch that. Try again.")
                continue

            command = transcribe_pcm16(pcm).strip()
            print(f"You said: {command}")

            if not command:
                speak("I didn't catch that. Try again.")
                continu

