# Kaamly 🚀

**Kaamly** is a task automation app that takes natural language instructions like _“Book a salon tomorrow at 4 PM near CP”_ and handles everything — understanding intent, finding a provider, making a real phone call, scheduling the appointment, and emailing you a calendar invite.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [OmniDimension Voice Agent](#omnidimension-voice-agent)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Features



- 🧠 **AI-Powered Parsing**: Uses Gemini 1.5 Flash to understand natural language requests
- 📍 **Location Search**: Finds nearby service providers using OpenStreetMap
- ☎️ **Automated Calling**: Makes appointment calls using omniDimension AI voice agents
- 📧 **Email Integration**: Sends confirmations with calendar attachments via Resend
- 📅 **Calendar Integration**: Generates .ics files for easy calendar import
- 🔔 **Smart Reminders**: Automated reminder system for upcoming appointments
- 📊 **Dashboard**: View and manage all your appointments
- 🔐 **Secure**: Built with Supabase auth and Row Level Security

---

## 🛠 Tech Stack

| Layer         | Technology                         |
|--------------|-------------------------------------|
| Frontend     | Next.js 15, TypeScript, Tailwind CSS|
| Styling/UI   | shadcn/ui, lucide-react             |
| NLP/AI       | OpenAI GPT-4o or Gemini API         |
| Voice Agent  | OmniDimension                       |
| DB/ORM       | Supabase, Prisma                    |
| Email        | Resend                              |
| Calendar     | `.ics` generation via `jspdf`       |

---

##screenshots of website
![image](https://github.com/user-attachments/assets/74265b9a-006d-42d5-a6f1-954b11e0ee46)
![image](https://github.com/user-attachments/assets/d7ce4c4b-e699-4d19-a68d-7e1e5f32fbfa)
![image](https://github.com/user-attachments/assets/7ce92ec7-5b83-4e34-a6d4-d704d249b9f6)




here is when i started the project i uploaed it today:
![image](https://github.com/user-attachments/assets/38b1fee2-89ff-4821-a58d-4ff9ae6c1ac5)



## wokflow

✅ Natural Language Interface
→ Users initiate task via plain English like “Book haircut near me”.

✅ Location-Aware AI Agent
→ Fetches current GPS using map APIs to localize the query.

✅ AI-Powered Search & Planning (Gemini)
→ Detects intent, searches relevant providers, plans next steps.

✅ Phone Call Automation (Simulated)
→ Auto-dials salons and negotiates appointment time/cost.

✅ Database Logging
→ Stores location, search results, call logs, and appointment details.

✅ Confirmation & Notifications
→ Sends final booking info via message/notification.✅ Location-Aware AI Agent
→ Fetches current GPS using map APIs to localize the query.

✅ AI-Powered Search & Planning (Gemini)
→ Detects intent, searches relevant providers, plans next steps.

✅ Phone Call Automation (Simulated)
→ Auto-dials salons and negotiates appointment time/cost.

✅ Database Logging
→ Stores location, search results, call logs, and appointment details.

✅ Confirmation & Notifications
→ Sends final booking info via message/notification.



## 📞 OmniDimension Voice Agent
Sign up at omnidimension.ai

Create a voice agent or bot and define your dialog flow (e.g., name, appointment time)

Copy your API key and script ID

Trigger the call in your app via:

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/uzumaki-ak/kaamly.git
cd kaamly
npm install
npm run dev
Visit http://localhost:3000


🔮 Future Enhancements
Google Calendar API integration

Real-time task monitoring dashboard

Add Web Speech for voice input/output

Admin panel for managing tasks

Multi-agent breakdown and logging



