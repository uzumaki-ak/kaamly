import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendReminderEmail } from "@/lib/services/email"

export async function GET(request: NextRequest) {
  try {
    // Check for appointments in the next 2 hours
    const twoHoursFromNow = new Date()
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2)

    const oneHourFromNow = new Date()
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1)

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        scheduledTime: {
          gte: oneHourFromNow,
          lte: twoHoursFromNow,
        },
        status: "confirmed",
      },
      include: {
        user: true,
      },
    })

    const results = []

    for (const appointment of upcomingAppointments) {
      try {
        const emailResult = await sendReminderEmail(appointment.user.email, appointment)

        results.push({
          appointmentId: appointment.id,
          email: appointment.user.email,
          success: emailResult.success,
        })
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, error)
        results.push({
          appointmentId: appointment.id,
          email: appointment.user.email,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Error processing reminders:", error)
    return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 })
  }
}
