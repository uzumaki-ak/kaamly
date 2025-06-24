import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const callLogs = await prisma.omnidimCallLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        matchedAppointment: {
          select: {
            id: true,
            type: true,
            providerName: true,
            status: true,
            scheduledTime: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      callLogs: callLogs.map((log) => ({
        id: log.id,
        callId: log.callId,
        callerName: log.callerName,
        salonName: log.salonName,
        clientName: log.clientName,
        appointmentStatus: log.appointmentStatus,
        duration: log.duration,
        processed: log.processed,
        createdAt: log.createdAt.toISOString(),
        matchedAppointment: log.matchedAppointment,
      })),
    })
  } catch (error) {
    console.error("❌ Error fetching call logs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch call logs" }, { status: 500 })
  }
}
