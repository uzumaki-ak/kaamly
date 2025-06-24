import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { agentId, phoneNumber, agentName } = await request.json()

    if (!agentId || !phoneNumber) {
      return NextResponse.json({ success: false, error: "Agent ID and phone number required" }, { status: 400 })
    }

    // Save Omnidim agent configuration
    const omnidimConfig = await prisma.omnidimConfig.upsert({
      where: { id: "main" },
      update: {
        agentId,
        phoneNumber,
        agentName: agentName || "Saloni AI",
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        id: "main",
        agentId,
        phoneNumber,
        agentName: agentName || "Saloni AI",
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      config: omnidimConfig,
      message: "Omnidim agent configured successfully!",
    })
  } catch (error) {
    console.error("❌ Setup error:", error)
    return NextResponse.json({ success: false, error: "Setup failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const config = await prisma.omnidimConfig.findUnique({
      where: { id: "main" },
    })

    return NextResponse.json({
      success: true,
      config,
      isConfigured: !!config?.agentId,
    })
  } catch (error) {
    console.error("❌ Get config error:", error)
    return NextResponse.json({ success: false, error: "Failed to get config" }, { status: 500 })
  }
}
