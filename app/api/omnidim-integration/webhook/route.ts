import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Completely new webhook handler for Omnidim
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("🔔 Omnidim Integration Webhook:", body)

    // Handle different Omnidim events
    const { event_type, call_id, extracted_variables, call_status, transcript, call_duration } = body

    if (event_type === "call_completed") {
      await handleOmnidimCallCompleted(call_id, extracted_variables, transcript, call_duration)
    }

    return NextResponse.json({ success: true, message: "Webhook processed" })
  } catch (error) {
    console.error("❌ Omnidim webhook error:", error)
    return NextResponse.json({ success: false, error: "Webhook failed" }, { status: 500 })
  }
}

async function handleOmnidimCallCompleted(callId: string, extractedVars: any, transcript: string, duration: number) {
  try {
    console.log("📞 Processing Omnidim call:", callId)
    console.log("📋 Extracted data:", extractedVars)

    // Extract the variables from your Saloni AI
    const {
      caller_name,
      salon_name,
      appointment_date,
      appointment_time,
      client_name,
      appointment_status, // "confirmed", "rescheduled", "cancelled"
      new_appointment_date,
      new_appointment_time,
    } = extractedVars || {}

    // Create new call log entry
    const callLog = await prisma.omnidimCallLog.create({
      data: {
        callId: callId,
        callerName: caller_name || "Unknown",
        salonName: salon_name || "Unknown Salon",
        clientName: client_name || "Unknown Client",
        appointmentDate: appointment_date || null,
        appointmentTime: appointment_time || null,
        appointmentStatus: appointment_status || "unknown",
        newAppointmentDate: new_appointment_date || null,
        newAppointmentTime: new_appointment_time || null,
        transcript: transcript || "",
        duration: duration || 0,
        processed: false,
      },
    })

    console.log("✅ Omnidim call log saved:", callLog.id)

    // Try to match with existing appointments
    await matchOmnidimCallToAppointment(callLog.id, {
      salon_name,
      client_name,
      appointment_date,
      appointment_status,
      new_appointment_date,
      new_appointment_time,
    })

    return callLog
  } catch (error) {
    console.error("❌ Error processing Omnidim call:", error)
    throw error
  }
}

async function matchOmnidimCallToAppointment(callLogId: string, data: any) {
  try {
    // Find recent appointments that might match
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        status: {
          in: ["pending", "confirmed"],
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: { createdAt: "desc" },
    })

    for (const appointment of recentAppointments) {
      // Match by provider name similarity
      const providerMatch =
        data.salon_name &&
        appointment.providerName &&
        appointment.providerName.toLowerCase().includes(data.salon_name.toLowerCase())

      // Match by service type (salon, hair, etc.)
      const serviceMatch =
        appointment.type &&
        (appointment.type.toLowerCase().includes("salon") ||
          appointment.type.toLowerCase().includes("hair") ||
          appointment.type.toLowerCase().includes("beauty"))

      if (providerMatch || serviceMatch) {
        // Update the appointment based on call outcome
        let newStatus = appointment.status
        let newScheduledTime = appointment.scheduledTime

        if (data.appointment_status === "confirmed") {
          newStatus = "confirmed"
        } else if (data.appointment_status === "cancelled") {
          newStatus = "cancelled"
        } else if (data.appointment_status === "rescheduled" && data.new_appointment_date) {
          newStatus = "confirmed"
          // Parse new date and time
          try {
            newScheduledTime = new Date(`${data.new_appointment_date} ${data.new_appointment_time || "14:00"}`)
          } catch (e) {
            console.log("Could not parse new date, keeping original")
          }
        }

        // Update appointment
        await prisma.appointment.update({
          where: { id: appointment.id },
          data: {
            status: newStatus,
            scheduledTime: newScheduledTime,
            notes:
              `${appointment.notes || ""}\n\nOmnidim Call: ${data.appointment_status} by ${data.salon_name}`.trim(),
          },
        })

        // Mark call log as processed
        await prisma.omnidimCallLog.update({
          where: { id: callLogId },
          data: {
            processed: true,
            matchedAppointmentId: appointment.id,
          },
        })

        console.log(`📋 Matched and updated appointment ${appointment.id} to ${newStatus}`)
        break
      }
    }
  } catch (error) {
    console.error("❌ Error matching appointment:", error)
  }
}
