import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

interface VoiceResponse {
  message: string
  intent: string
  nextStep: string
  shouldExecute: boolean
  collectedData?: {
    serviceType?: string
    userEmail?: string
    location?: string
    preferences?: string
    timePreference?: string
    pricePreference?: string
    additionalRequirements?: string
  }
}

export async function processVoiceMessage(session: any, userMessage: string): Promise<VoiceResponse> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  // Build context from session
  const context = buildSessionContext(session)

  const prompt = `
You are a helpful voice assistant for a task execution app. Your job is to collect information from users to help them find and book services.

Current session context:
${context}

Current step: ${session.currentStep}
User just said: "${userMessage}"

Based on the conversation flow, determine:
1. What information the user provided
2. What to ask next
3. Whether we have enough info to proceed

Conversation flow:
1. greeting -> ask what service they need
2. collecting_service -> ask for email
3. collecting_email -> ask for location  
4. collecting_location -> ask for preferences (time, budget, etc.)
5. collecting_preferences -> confirm and ask to proceed
6. confirming -> execute the task
7. completed -> answer questions about the process

Respond with JSON only:
{
  "message": "What to say to the user",
  "intent": "detected intent (service_type, email, location, preferences, confirmation, question)",
  "nextStep": "next conversation step",
  "shouldExecute": false,
  "collectedData": {
    "serviceType": "extracted service if any",
    "userEmail": "extracted email if any", 
    "location": "extracted location if any",
    "preferences": "extracted preferences if any",
    "timePreference": "extracted time if any",
    "pricePreference": "extracted budget if any",
    "additionalRequirements": "any special requests"
  }
}

Keep responses conversational and friendly. If user asks about task execution details, explain the 6-step process.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean and parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed
    }

    // Fallback response
    return {
      message: "I'm sorry, I didn't quite understand that. Could you please repeat?",
      intent: "clarification",
      nextStep: session.currentStep,
      shouldExecute: false,
    }
  } catch (error) {
    console.error("Error processing voice message:", error)
    return {
      message: "I'm having trouble processing that. Could you try again?",
      intent: "error",
      nextStep: session.currentStep,
      shouldExecute: false,
    }
  }
}

function buildSessionContext(session: any): string {
  const context = []

  context.push(`Session ID: ${session.id}`)
  context.push(`Current step: ${session.currentStep}`)

  if (session.serviceType) context.push(`Service needed: ${session.serviceType}`)
  if (session.userEmail) context.push(`Email: ${session.userEmail}`)
  if (session.location) context.push(`Location: ${session.location}`)
  if (session.timePreference) context.push(`Time preference: ${session.timePreference}`)
  if (session.pricePreference) context.push(`Budget: ${session.pricePreference}`)
  if (session.additionalRequirements) context.push(`Special requirements: ${session.additionalRequirements}`)

  // Add recent conversation history
  if (session.messages && session.messages.length > 0) {
    context.push("\nRecent conversation:")
    const recentMessages = session.messages.slice(-6) // Last 6 messages
    recentMessages.forEach((msg: any) => {
      context.push(`${msg.speaker}: ${msg.message}`)
    })
  }

  return context.join("\n")
}

export async function explainTaskExecution(taskId: string): Promise<string> {
  // This function can provide detailed explanations about task execution
  // You can integrate this with your existing task execution details
  return `Here's how I processed your request:

1. **Parsed your request** ✅ - I analyzed what you said and understood you needed a service
2. **Searched providers** ✅ - I found nearby providers using real map data  
3. **Selected best option** ✅ - I picked the best match based on your preferences
4. **Made appointment call** ✅ - I contacted the provider to book your appointment
5. **Saved appointment** ✅ - I stored all details in the system
6. **Sent confirmation** ✅ - I emailed you the confirmation with calendar file

You can ask me about any specific step for more details!`
}
