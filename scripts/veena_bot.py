import json
import pyttsx3
import speech_recognition as sr
from fpdf import FPDF

# Load conversation flow
with open("veena_bot_flow.json", "r", encoding="utf-8") as f:
    flow = json.load(f)

# Voice Engine Init
engine = pyttsx3.init()
r = sr.Recognizer()

# Start Node
current_node = flow["start_node"]
conversation = []
language = "en"

def speak(text):
    print(f"Veena: {text}")
    engine.say(text)
    engine.runAndWait()
    conversation.append(("Veena", text))

def listen():
    with sr.Microphone() as source:
        print("🎤 Listening...")
        audio = r.listen(source)
        try:
            response = r.recognize_google(audio, language='hi-IN' if language == "hi" else 'en-IN')
            print(f"User: {response}")
            conversation.append(("User", response))
            return response.lower()
        except sr.UnknownValueError:
            speak("Sorry, I didn’t understand that.")
            return listen()

# Simulate policyholder info
context = {
    "policy_holder_name": "Rahul Sharma",
    "policy_number": "VE123456",
    "product_name": "ULIP Wealth Plan",
    "policy_start_date": "01-Jan-2021",
    "total_premium_paid": "15000",
    "outstanding_amount": "5000",
    "premium_due_date": "30-Jun-2025",
    "sum_assured": "2,00,000",
    "fund_value": "38,000"
}

def fill_template(template):
    for key, val in context.items():
        template = template.replace(f"{{{key}}}", val)
    return template

# Main flow
while current_node:
    node = flow["nodes"][current_node]

    if isinstance(node["speak"], dict):
        message = fill_template(node["speak"].get(language, node["speak"]["en"]))
    else:
        message = fill_template(node["speak"])

    speak(message)

    if "transitions" not in node:
        break

    user_input = listen()

    # Language switch check
    if "hindi" in user_input or "हिंदी" in user_input:
        language = "hi"
        speak("ठीक है, अब हम हिंदी में बात करेंगे।")
        continue

    matched = False
    for keyword, next_node in node["transitions"].items():
        if keyword in user_input:
            current_node = next_node
            matched = True
            break

    if not matched:
        speak("I’m sorry, let’s try again.")

# Save transcript to PDF
def save_transcript(convo):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Call Transcript", ln=True, align='C')
    for speaker, line in convo:
        pdf.multi_cell(0, 10, f"{speaker}: {line}")
    pdf.output("veena_call_transcript.pdf")
    print("Transcript saved as veena_call_transcript.pdf")

save_transcript(conversation)
