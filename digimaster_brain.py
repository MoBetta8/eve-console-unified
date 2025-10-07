import requests
import os
import sys
import platform
from pathlib import Path
from dotenv import load_dotenv
import subprocess

load_dotenv()

# === CONFIG ===
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    print("❌ Error: OPENROUTER_API_KEY not found in environment variables.")
    print("Please create a .env file with your API key or set it as an environment variable.")
    sys.exit(1)

# Cross-platform voice model paths
if platform.system() == "Windows":
    VOICE_MODEL = r"C:\piper_voices\en_amy\en_US-amy-medium.onnx"
    VOICE_CONFIG = r"C:\piper_voices\en_amy\en_US-amy-medium.onnx.json"
    OUTPUT_FILE = r"C:\piper_voices\en_amy\response.wav"
else:
    # Unix-like systems (Linux, macOS)
    home = Path.home()
    voice_dir = home / "piper_voices" / "en_amy"
    VOICE_MODEL = str(voice_dir / "en_US-amy-medium.onnx")
    VOICE_CONFIG = str(voice_dir / "en_US-amy-medium.onnx.json")
    OUTPUT_FILE = str(voice_dir / "response.wav")

# === ASK GPT ===
def ask_gpt(prompt):
    """
    Send a prompt to the AI model and get a response.
    
    Args:
        prompt (str): The user's question or message
        
    Returns:
        str: The AI's response or error message
    """
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/MoBetta8/eve-console-unified",
        "X-Title": "Eve Console"
    }
    data = {
        "model": "deepseek/deepseek-chat-v3.1:free",
        "messages": [{"role": "user", "content": prompt}],
    }

    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0]["message"]["content"]
        else:
            return f"Error: Unexpected response format from API"
    except requests.exceptions.Timeout:
        return "Error: Request timed out. Please try again."
    except requests.exceptions.RequestException as e:
        return f"Error talking to GPT: {e}"
    except (KeyError, IndexError) as e:
        return f"Error parsing response: {e}"

# === SPEAK OUT LOUD ===
def speak(text):
    """
    Convert text to speech using Piper TTS (if available).
    Falls back to text-only output if TTS is not configured.
    
    Args:
        text (str): The text to speak
    """
    print(f"\n🧠 Eve says: {text}\n")
    
    # Check if voice files exist
    if not Path(VOICE_MODEL).exists():
        print("⚠️ Voice model not found. Text-to-speech disabled.")
        print(f"   Expected model at: {VOICE_MODEL}")
        return
    
    try:
        # Run Piper TTS
        subprocess.run([
            "piper",
            "--model", VOICE_MODEL,
            "--config", VOICE_CONFIG,
            "--output_file", OUTPUT_FILE
        ], input=text.encode(), check=True, timeout=10)
        
        # Play the audio file
        if platform.system() == "Windows":
            subprocess.run(["start", OUTPUT_FILE], shell=True, check=False)
        elif platform.system() == "Darwin":  # macOS
            subprocess.run(["open", OUTPUT_FILE], check=False)
        else:  # Linux
            # Try common audio players
            for player in ["xdg-open", "paplay", "aplay"]:
                try:
                    subprocess.run([player, OUTPUT_FILE], check=False, timeout=5)
                    break
                except (subprocess.SubprocessError, FileNotFoundError):
                    continue
    except FileNotFoundError:
        print("⚠️ Piper TTS not installed. Text-to-speech disabled.")
    except subprocess.TimeoutExpired:
        print("⚠️ TTS timeout. Continuing with text-only output.")
    except Exception as e:
        print(f"⚠️ Error in text-to-speech: {e}")
        print("   Continuing with text-only output.")

# === MAIN LOOP ===
if __name__ == "__main__":
    print("=" * 60)
    print("🤖 Eve Console - Digimaster Assistant is online!")
    print("=" * 60)
    print("Type your message and press Enter.")
    print("Type 'exit' or 'quit' to end the session.")
    print("=" * 60)
    print()
    
    while True:
        try:
            user_input = input("🗨️ You: ").strip()
            
            if not user_input:
                continue
                
            if user_input.lower() in ["exit", "quit", "bye", "goodbye"]:
                print("\n👋 Goodbye! Eve signing off.")
                break
                
            print("🤔 Thinking...")
            reply = ask_gpt(user_input)
            speak(reply)
            
        except KeyboardInterrupt:
            print("\n\n👋 Session interrupted. Goodbye!")
            break
        except EOFError:
            print("\n\n👋 End of input. Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Unexpected error: {e}")
            print("Please try again or type 'exit' to quit.\n")
