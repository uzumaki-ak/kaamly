import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🔔 Omnidim webhook received!")

    const body = await request.json()
    console.log("📞 Webhook data:", JSON.stringify(body, null, 2))

    // Extract call information from Omnidim webhook
    const { call_id, status, duration, transcript, summary, extracted_variables, metadata } = body

    console.log(`📞 Call ${call_id} completed with status: ${status}`)

    // Update the call log in database
    if (call_id) {
      try {
        const updatedCallLog = await prisma.personalCallLog.updateMany({
          where: {
            omnidimCallId: call_id,
          },
          data: {
            status: status === "completed" ? "completed" : "failed",
            duration: duration || 0,
            transcript: transcript || null,
            summary: summary || null,
            extractedData: extracted_variables || {},
            completedAt: new Date(),
          },
        })

        console.log(`✅ Updated ${updatedCallLog.count} call log(s)`)
      } catch (dbError) {
        console.error("❌ Database update failed:", dbError)
      }
    }

    // Log extracted variables from your Saloni AI agent
    if (extracted_variables) {
      console.log("🤖 Extracted variables from Saloni AI:")
      console.log("- Caller name:", extracted_variables.caller_name)
      console.log("- Salon name:", extracted_variables.salon_name)
      console.log("- Appointment date:", extracted_variables.appointment_date)
      console.log("- Appointment time:", extracted_variables.appointment_time)
      console.log("- Client name:", extracted_variables.client_name)
      console.log("- Appointment status:", extracted_variables.appointment_status)
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      received_call_id: call_id,
    })
  } catch (error) {
    console.error("❌ Webhook processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed",
      },
      { status: 500 },
    )
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  console.log("🔍 Webhook verification request received")
  return NextResponse.json({
    status: "Webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
