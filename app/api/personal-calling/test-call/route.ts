import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userEmail = "anikeshuzumaki@gmail.com", scenario = "greeting" } = await request.json()

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        personalCallingConfig: true,
      },
    })

    if (!user?.personalCallingConfig?.phoneNumber) {
      return NextResponse.json({ success: false, error: "No phone number configured" }, { status: 400 })
    }

    // Create test scenarios
    const scenarios = {
      greeting: {
        script:
          "Hello! This is Saloni, your AI assistant. I'm calling to test our connection. Can you hear me clearly?",
        duration: 30,
        summary: "Test call - greeting and connection check",
      },
      appointment_reminder: {
        script:
          "Hi! This is Saloni calling to remind you about your upcoming salon appointment tomorrow at 2 PM. Please confirm if you'll be attending.",
        duration: 45,
        summary: "Test call - appointment reminder",
      },
      booking_confirmation: {
        script:
          "Hello! This is Saloni. I've successfully booked your haircut appointment for tomorrow. The salon has confirmed your slot. Any questions?",
        duration: 60,
        summary: "Test call - booking confirmation",
      },
    }

    const selectedScenario = scenarios[scenario as keyof typeof scenarios] || scenarios.greeting

    // Simulate call (since international calling might not work)
    const callLog = await prisma.personalCallLog.create({
      data: {
        userId: user.id,
        phoneNumber: user.personalCallingConfig.phoneNumber,
        callReason: `test_${scenario}`,
        omnidimCallId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "completed",
        duration: selectedScenario.duration,
        transcript: `Saloni AI: "${selectedScenario.script}"\nUser: "Yes, I can hear you clearly. Thanks for calling!"\nSaloni AI: "Perfect! Have a great day!"`,
        summary: selectedScenario.summary,
        callData: { test: true, scenario },
      },
    })

    return NextResponse.json({
      success: true,
      callLog,
      message: `Test call simulated: ${scenario}`,
      scenario: selectedScenario,
    })
  } catch (error) {
    console.error("❌ Test call error:", error)
    return NextResponse.json({ success: false, error: "Test call failed" }, { status: 500 })
  }
}
