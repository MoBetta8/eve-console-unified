import requests
import os
from dotenv import load_dotenv
load_dotenv()
import subprocess


# === CONFIG ===
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY environment variable is not set. Please set it in your .env file.")

VOICE_MODEL = os.getenv("VOICE_MODEL", "C:\\piper_voices\\en_amy\\en_US-amy-medium.onnx")
VOICE_CONFIG = os.getenv("VOICE_CONFIG", "C:\\piper_voices\\en_amy\\en_US-amy-medium.onnx.json")
OUTPUT_FILE = os.getenv("OUTPUT_FILE", "C:\\piper_voices\\en_amy\\response.wav")

# === ASK GPT ===
def ask_gpt(prompt):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek/deepseek-chat-v3.1:free",
        "messages": [{"role": "user", "content": prompt}],
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error talking to GPT: {e}"

# === SPEAK OUT LOUD ===
def speak(text):
    print(f"\n🧠 Amy says: {text}\n")
    subprocess.run([
        "piper",
        "--model", VOICE_MODEL,
        "--config", VOICE_CONFIG,
        "--output_file", OUTPUT_FILE
    ], input=text.encode(), check=True)
    subprocess.run(["start", OUTPUT_FILE], shell=True)

# === MAIN LOOP ===
if __name__ == "__main__":
    print("🤖 Digimaster Assistant is online. Type your message and press Enter.")
    while True:
        user_input = input("🗨️ You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Goodbye.")
            break
        reply = ask_gpt(user_input)
        speak(reply)
