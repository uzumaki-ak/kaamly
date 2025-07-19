import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail") || "anikeshuzumaki@gmail.com"

    console.log(`📞 Fetching call logs for: ${userEmail}`)

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Get call logs from database
    const callLogs = await prisma.personalCallLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        appointment: {
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

    // For each call log, try to get updated details from OmniDimension
    const enrichedCallLogs = await Promise.all(
      callLogs.map(async (log) => {
        try {
          // Try to get call details from OmniDimension
          const callDetails = await getOmniDimensionCallDetails(log.omnidimCallId)

          return {
            id: log.id,
            omnidimCallId: log.omnidimCallId,
            phoneNumber: log.phoneNumber,
            callReason: log.callReason,
            status: callDetails?.status || log.status,
            duration: callDetails?.duration || log.duration || 0,
            transcript: callDetails?.transcript || log.transcript || "Call completed - transcript processing...",
            summary:
              callDetails?.summary || log.summary || `${log.callReason.replace(/_/g, " ")} call completed successfully`,
            createdAt: log.createdAt.toISOString(),
            completedAt: log.completedAt?.toISOString() || null,
            appointment: log.appointment,
            extractedData: callDetails?.extractedData || log.extractedData || {},
          }
        } catch (error) {
          console.error(`❌ Error enriching call log ${log.id}:`, error)
          return {
            id: log.id,
            omnidimCallId: log.omnidimCallId,
            phoneNumber: log.phoneNumber,
            callReason: log.callReason,
            status: log.status,
            duration: log.duration || 0,
            transcript: log.transcript || "Call completed - transcript not available",
            summary: log.summary || `${log.callReason.replace(/_/g, " ")} call completed`,
            createdAt: log.createdAt.toISOString(),
            completedAt: log.completedAt?.toISOString() || null,
            appointment: log.appointment,
            extractedData: log.extractedData || {},
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      callLogs: enrichedCallLogs,
      count: enrichedCallLogs.length,
    })
  } catch (error) {
    console.error("❌ Error fetching call logs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch call logs" }, { status: 500 })
  }
}

async function getOmniDimensionCallDetails(callId: string) {
  try {
    if (!callId) return null

    // Use Python script to get call details
    const { exec } = require("child_process")
    const { promisify } = require("util")
    const execAsync = promisify(exec)
    const path = require("path")

    const scriptPath = path.join(process.cwd(), "scripts", "get-call-details.py")
    const command = `python "${scriptPath}" "${callId}"`

    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env },
      timeout: 10000,
    })

    if (stderr) {
      console.error("❌ Python script stderr:", stderr)
    }

    const result = JSON.parse(stdout.trim())
    return result.success ? result.data : null
  } catch (error) {
    console.error("❌ Error getting call details:", error)
    return null
  }
}
