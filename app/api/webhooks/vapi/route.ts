import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const callData = await request.json()

    // Process Vapi webhook data
    const { call, transcript, status } = callData

    if (status === "ended" && call?.metadata?.appointmentId) {
      // Update appointment based on call results
      const appointmentId = call.metadata.appointmentId

      // Analyze transcript to determine if appointment was confirmed
      const isConfirmed =
        transcript?.toLowerCase().includes("confirmed") ||
        transcript?.toLowerCase().includes("booked") ||
        transcript?.toLowerCase().includes("yes")

      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: isConfirmed ? "confirmed" : "pending",
          notes: `Call completed. Transcript: ${transcript?.substring(0, 500)}`,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
