import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { executeTask } from "@/lib/services/task-executor"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Get session with collected data
    const session = await prisma.voiceSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Build user input from collected data
    const userInput = buildUserInputFromSession(session)

    // Execute the task using existing system
    const taskResult = await executeTask(session.userId, session.userEmail || "demo@example.com", userInput)

    // Update session with task result
    await prisma.voiceSession.update({
      where: { id: sessionId },
      data: {
        status: taskResult.success ? "completed" : "failed",
        currentStep: "completed",
        taskId: taskResult.taskId,
        completedAt: new Date(),
      },
    })

    // Create completion message
    const completionMessage = taskResult.success
      ? `Great! I've successfully found and booked your ${session.serviceType} appointment. The provider has been contacted and you'll receive a confirmation email shortly. You can ask me about any details of the booking process!`
      : `I'm sorry, but I encountered an issue while processing your request: ${taskResult.error}. Would you like to try again?`

    await prisma.voiceMessage.create({
      data: {
        sessionId,
        speaker: "assistant",
        message: completionMessage,
        intent: "task_completion",
      },
    })

    return NextResponse.json({
      success: true,
      taskResult,
      message: completionMessage,
    })
  } catch (error) {
    console.error("Error executing task from voice session:", error)
    return NextResponse.json({ error: "Failed to execute task" }, { status: 500 })
  }
}

function buildUserInputFromSession(session: any): string {
  const parts = []

  if (session.serviceType) {
    parts.push(`Find a ${session.serviceType}`)
  }

  if (session.location) {
    parts.push(`near ${session.location}`)
  }

  if (session.timePreference) {
    parts.push(`for ${session.timePreference}`)
  }

  if (session.pricePreference) {
    parts.push(`${session.pricePreference}`)
  }

  if (session.additionalRequirements) {
    parts.push(`${session.additionalRequirements}`)
  }

  parts.push("and email me the details")

  return parts.join(" ")
}
