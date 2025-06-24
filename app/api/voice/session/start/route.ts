import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // For demo purposes, use a default user if not authenticated
    const userId = user?.id || "demo-user"
    const userEmail = user?.email || "demo@example.com"

    // Ensure user exists in our database
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: userEmail,
      },
      create: {
        id: userId,
        email: userEmail,
        name: user?.user_metadata?.name || "Demo User",
      },
    })

    // Create new voice session
    const session = await prisma.voiceSession.create({
      data: {
        userId,
        status: "active",
        currentStep: "greeting",
      },
    })

    // Create initial greeting message
    await prisma.voiceMessage.create({
      data: {
        sessionId: session.id,
        speaker: "assistant",
        message:
          "Hi! I'm your voice assistant. I can help you find and book services like restaurants, salons, hospitals, and more. What are you looking for today?",
        intent: "greeting",
      },
    })

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        currentStep: session.currentStep,
      },
    })
  } catch (error) {
    console.error("Error starting voice session:", error)
    return NextResponse.json({ error: "Failed to start voice session" }, { status: 500 })
  }
}
