import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { scenario, appointmentId } = await request.json()

    // Simulate different call scenarios for testing
    const scenarios = {
      confirmed: {
        caller_name: "Raj Kumar",
        salon_name: "Style Studio",
        client_name: "Test Customer",
        appointment_date: "2025-06-24",
        appointment_time: "14:00",
        appointment_status: "confirmed",
        transcript: `
Saloni AI: "Hello! You've reached the Saloni AI assistant for appointment confirmations. How can I assist you with your booking today?"
Caller: "Hi, I got a booking request for tomorrow 2 PM for a haircut."
Saloni AI: "Perfect! Can you confirm if you're available for that time?"
Caller: "Yes, I can accommodate that appointment."
Saloni AI: "Excellent! I'll mark this as confirmed and notify the customer."
        `,
        duration: 120,
      },
      rescheduled: {
        caller_name: "Priya Sharma",
        salon_name: "Beauty Palace",
        client_name: "Test Customer",
        appointment_date: "2025-06-24",
        appointment_time: "14:00",
        appointment_status: "rescheduled",
        new_appointment_date: "2025-06-25",
        new_appointment_time: "16:00",
        transcript: `
Saloni AI: "Hello! You've reached the Saloni AI assistant for appointment confirmations."
Caller: "I got a booking for tomorrow 2 PM but I'm not available then."
Saloni AI: "I understand. What alternative time would work for you?"
Caller: "Can we do day after tomorrow at 4 PM instead?"
Saloni AI: "Perfect! I'll update the appointment to the new time."
        `,
        duration: 90,
      },
      cancelled: {
        caller_name: "Amit Singh",
        salon_name: "Hair Studio",
        client_name: "Test Customer",
        appointment_date: "2025-06-24",
        appointment_time: "14:00",
        appointment_status: "cancelled",
        transcript: `
Saloni AI: "Hello! You've reached the Saloni AI assistant for appointment confirmations."
Caller: "I received a booking but I'm fully booked that day."
Saloni AI: "I understand. Are there any alternative dates you could accommodate?"
Caller: "Unfortunately no, I'm completely booked this week."
Saloni AI: "No problem, I'll find other options for the customer."
        `,
        duration: 60,
      },
    }

    const selectedScenario = scenarios[scenario as keyof typeof scenarios] || scenarios.confirmed

    // Create simulated call log
    const callLog = await prisma.omnidimCallLog.create({
      data: {
        callId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callerName: selectedScenario.caller_name,
        salonName: selectedScenario.salon_name,
        clientName: selectedScenario.client_name,
        appointmentDate: selectedScenario.appointment_date,
        appointmentTime: selectedScenario.appointment_time,
        appointmentStatus: selectedScenario.appointment_status,
        newAppointmentDate: selectedScenario.new_appointment_date || null,
        newAppointmentTime: selectedScenario.new_appointment_time || null,
        transcript: selectedScenario.transcript,
        duration: selectedScenario.duration,
        processed: false,
      },
    })

    // If specific appointment ID provided, update it
    if (appointmentId) {
      let newStatus = "pending"
      let newScheduledTime = undefined

      if (selectedScenario.appointment_status === "confirmed") {
        newStatus = "confirmed"
      } else if (selectedScenario.appointment_status === "cancelled") {
        newStatus = "cancelled"
      } else if (selectedScenario.appointment_status === "rescheduled") {
        newStatus = "confirmed"
        newScheduledTime = new Date(`${selectedScenario.new_appointment_date} ${selectedScenario.new_appointment_time}`)
      }

      const updateData: any = {
        status: newStatus,
        notes: `Simulated Omnidim call: ${selectedScenario.appointment_status}`,
      }

      if (newScheduledTime) {
        updateData.scheduledTime = newScheduledTime
      }

      await prisma.appointment.update({
        where: { id: appointmentId },
        data: updateData,
      })

      // Mark call as processed
      await prisma.omnidimCallLog.update({
        where: { id: callLog.id },
        data: {
          processed: true,
          matchedAppointmentId: appointmentId,
        },
      })
    }

    return NextResponse.json({
      success: true,
      callLog,
      scenario: selectedScenario,
      message: `Simulated ${selectedScenario.appointment_status} call completed`,
    })
  } catch (error) {
    console.error("❌ Simulation error:", error)
    return NextResponse.json({ success: false, error: "Simulation failed" }, { status: 500 })
  }
}
