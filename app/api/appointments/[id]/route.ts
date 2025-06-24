import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "cancelled" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error canceling appointment:", error)
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 })
  }
}
