import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { processVoiceMessage } from "@/lib/services/voice-assistant"


export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, audioTranscript, confidence } = await request.json()

    if (!sessionId || !message) {
      return NextResponse.json({ error: "Session ID and message are required" }, { status: 400 })
    }

    // Get current session
    const session = await prisma.voiceSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
        },
      },
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (session.status !== "active") {
      return NextResponse.json({ error: "Session is not active" }, { status: 400 })
    }

    // Save user message
    await prisma.voiceMessage.create({
      data: {
        sessionId,
        speaker: "user",
        message,
        audioTranscript,
        confidence,
      },
    })

    // Process the message and generate response
    const response = await processVoiceMessage(session, message)

    // Save assistant response
    await prisma.voiceMessage.create({
      data: {
        sessionId,
        speaker: "assistant",
        message: response.message,
        intent: response.intent,
      },
    })

    // Update session state
    await prisma.voiceSession.update({
      where: { id: sessionId },
      data: {
        currentStep: response.nextStep,
        lastActiveAt: new Date(),
        serviceType: response.collectedData?.serviceType || session.serviceType,
        userEmail: response.collectedData?.userEmail || session.userEmail,
        location: response.collectedData?.location || session.location,
        preferences: response.collectedData?.preferences || session.preferences,
        timePreference: response.collectedData?.timePreference || session.timePreference,
        pricePreference: response.collectedData?.pricePreference || session.pricePreference,
        additionalRequirements: response.collectedData?.additionalRequirements || session.additionalRequirements,
      },
    })

    return NextResponse.json({
      success: true,
      response: {
        message: response.message,
        intent: response.intent,
        nextStep: response.nextStep,
        shouldExecute: response.shouldExecute,
        collectedData: response.collectedData,
      },
    })
  } catch (error) {
    console.error("Error processing voice message:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
