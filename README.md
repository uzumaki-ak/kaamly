# 🤖 Automated Task Execution App

An AI-powered system that executes complex tasks automatically based on natural language input.

## Features

- 🧠 **AI-Powered Parsing**: Uses Gemini 1.5 Flash to understand natural language requests
- 📍 **Location Search**: Finds nearby service providers using OpenStreetMap
- ☎️ **Automated Calling**: Makes appointment calls using Vapi AI voice agents
- 📧 **Email Integration**: Sends confirmations with calendar attachments via Resend
- 📅 **Calendar Integration**: Generates .ics files for easy calendar import
- 🔔 **Smart Reminders**: Automated reminder system for upcoming appointments
- 📊 **Dashboard**: View and manage all your appointments
- 🔐 **Secure**: Built with Supabase auth and Row Level Security

## Setup Instructions

### 1. Environment Variables

Copy `.env.local` and fill in your API keys:

\`\`\`bash
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url

# AI
GOOGLE_AI_API_KEY=your_gemini_api_key

# Voice Calling
VAPI_API_KEY=your_vapi_api_key

# Email
RESEND_API_KEY=your_resend_api_key
\`\`\`

### 2. Database Setup

\`\`\`bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Run the init script in Supabase SQL editor
\`\`\`

### 3. API Keys Setup

#### Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Get URL and anon key from Settings > API

#### Google AI (Gemini)
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### Vapi (Voice Calling)
1. Sign up at [vapi.ai](https://vapi.ai)
2. Get API key from dashboard

#### Resend (Email)
1. Sign up at [resend.com](https://resend.com)
2. Get API key from dashboard

### 4. Run the App

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

## Usage Examples

Try these natural language commands:

- "Find a salon near me, book the cheapest slot for Friday, and email me the details"
- "Book a barber appointment in Delhi for tomorrow under ₹500"
- "Schedule a spa massage for this weekend and add it to my calendar"

## How It Works

1. **Parse Request**: AI analyzes your natural language input
2. **Search Providers**: Finds nearby service providers using location APIs
3. **Make Calls**: AI agent calls providers to book appointments
4. **Save Data**: Stores appointment details in database
5. **Send Email**: Sends confirmation with calendar attachment
6. **Set Reminders**: Automatically sends reminder emails

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
- **Voice**: Vapi AI voice agents
- **Email**: Resend with calendar attachments
- **Auth**: Supabase Auth

## API Endpoints

- `POST /api/execute-task` - Execute a natural language task
- `GET /api/appointments` - Get user appointments
- `DELETE /api/appointments/[id]` - Cancel appointment
- `GET /api/cron/reminders` - Send reminder emails (cron job)
- `POST /api/webhooks/vapi` - Handle Vapi call results

## Deployment

Deploy to Vercel:

\`\`\`bash
# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod
\`\`\`

Set up cron job for reminders:
- Add Vercel Cron job to call `/api/cron/reminders` every hour

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
