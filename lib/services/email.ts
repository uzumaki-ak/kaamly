import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function generateCalendarFile(appointmentDetails: any): Promise<string> {
  const startDate = new Date(appointmentDetails.scheduledTime)
  const endDate = new Date(startDate.getTime() + (appointmentDetails.duration || 60) * 60000)

  // Format date in iCalendar format: YYYYMMDDTHHMMSSZ
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+/g, "")
  }

  // Properly formatted iCalendar file with CRLF line endings
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Task Execution App//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${appointmentDetails.id}@taskapp.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${appointmentDetails.type} Appointment - ${appointmentDetails.providerName}`,
    `DESCRIPTION:Appointment Details\\n\\nService: ${appointmentDetails.type}\\nProvider: ${appointmentDetails.providerName}\\nLocation: ${appointmentDetails.location}\\nPrice: ${appointmentDetails.price || "TBD"}\\n\\nBooked via Task Execution App`,
    `LOCATION:${appointmentDetails.location}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return icsContent
}

export async function sendAppointmentEmail(
  userEmail: string,
  appointmentDetails: any,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if email is valid for Resend
    if (!userEmail || userEmail.includes("example.com") || userEmail === "demo@example.com") {
      console.log("Invalid email for Resend, using console output instead")

      // Log the email content to console for demo purposes
      console.log("\n=== EMAIL CONTENT (Demo Mode) ===")
      console.log(`To: ${userEmail}`)
      console.log(`Subject: Your ${appointmentDetails.type} Appointment is Confirmed!`)
      console.log("\n--- EMAIL BODY ---")
      console.log(`🎉 Appointment Confirmed!`)
      console.log(`Service: ${appointmentDetails.type}`)
      console.log(`Provider: ${appointmentDetails.providerName}`)
      console.log(`Date & Time: ${new Date(appointmentDetails.scheduledTime).toLocaleString()}`)
      console.log(`Location: ${appointmentDetails.location}`)
      console.log(`Price: ${appointmentDetails.price || "To be confirmed"}`)
      if (appointmentDetails.providerPhone) {
        console.log(`Contact: ${appointmentDetails.providerPhone}`)
      }
      console.log("\n📅 Calendar file would be attached")
      console.log("=== END EMAIL CONTENT ===\n")

      return {
        success: true,
        messageId: "demo-mode-" + Date.now(),
      }
    }

    const calendarFile = await generateCalendarFile(appointmentDetails)

    const { data, error } = await resend.emails.send({
      from: "Task App <onboarding@resend.dev>", // Use Resend's default sender
      to: [userEmail],
      subject: `Your ${appointmentDetails.type} Appointment is Confirmed!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Appointment Confirmed! 🎉</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #495057;">Appointment Details</h3>
            <p><strong>Service:</strong> ${appointmentDetails.type}</p>
            <p><strong>Provider:</strong> ${appointmentDetails.providerName}</p>
            <p><strong>Date & Time:</strong> ${new Date(appointmentDetails.scheduledTime).toLocaleString()}</p>
            <p><strong>Location:</strong> ${appointmentDetails.location}</p>
            <p><strong>Price:</strong> ${appointmentDetails.price || "To be confirmed"}</p>
            ${appointmentDetails.providerPhone ? `<p><strong>Contact:</strong> ${appointmentDetails.providerPhone}</p>` : ""}
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📅 Add to Calendar:</strong> Click the attachment below to add this appointment to your calendar app (Google Calendar, Outlook, Apple Calendar).</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>📞 Call Status:</strong> ${appointmentDetails.status === "confirmed" ? "✅ Provider was contacted successfully" : "⚠️ Unable to reach provider - please call them directly to confirm"}</p>
          </div>
          
          <div style="margin: 30px 0; text-align: center;">
            <p style="color: #666;">Need to reschedule or cancel? <a href="http://localhost:3000/dashboard" style="color: #007bff;">Manage your appointments</a></p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">This email was sent by Task Execution App. You received this because you requested an appointment booking.</p>
        </div>
      `,
      attachments: [
        {
          filename: "appointment.ics",
          content: Buffer.from(calendarFile).toString("base64"),
          contentType: "text/calendar; method=REQUEST; charset=utf-8",
        },
      ],
    })

    if (error) {
      throw error
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error("Error sending email:", error)

    // Fallback to console output for demo
    console.log("\n=== EMAIL FALLBACK (Error occurred) ===")
    console.log(`Failed to send to: ${userEmail}`)
    console.log(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    console.log(`Appointment: ${appointmentDetails.type} at ${appointmentDetails.providerName}`)
    console.log(`Time: ${new Date(appointmentDetails.scheduledTime).toLocaleString()}`)
    console.log("=== END EMAIL FALLBACK ===\n")

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendReminderEmail(
  userEmail: string,
  appointmentDetails: any,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Same validation as above
    if (!userEmail || userEmail.includes("example.com") || userEmail === "demo@example.com") {
      console.log("\n=== REMINDER EMAIL (Demo Mode) ===")
      console.log(`Reminder: Your ${appointmentDetails.type} appointment is in 2 hours`)
      console.log(`Provider: ${appointmentDetails.providerName}`)
      console.log(`Time: ${new Date(appointmentDetails.scheduledTime).toLocaleString()}`)
      console.log("=== END REMINDER EMAIL ===\n")

      return { success: true, messageId: "demo-reminder-" + Date.now() }
    }

    const { data, error } = await resend.emails.send({
      from: "Task App <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Reminder: Your ${appointmentDetails.type} appointment is in 2 hours`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Appointment Reminder ⏰</h2>
          
          <p>Hi! This is a friendly reminder that you have an upcoming appointment:</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="margin-top: 0; color: #856404;">Upcoming Appointment</h3>
            <p><strong>Service:</strong> ${appointmentDetails.type}</p>
            <p><strong>Provider:</strong> ${appointmentDetails.providerName}</p>
            <p><strong>Time:</strong> ${new Date(appointmentDetails.scheduledTime).toLocaleString()}</p>
            <p><strong>Location:</strong> ${appointmentDetails.location}</p>
            ${appointmentDetails.providerPhone ? `<p><strong>Contact:</strong> ${appointmentDetails.providerPhone}</p>` : ""}
          </div>
          
          <p>We recommend arriving 5-10 minutes early. Have a great appointment!</p>
        </div>
      `,
    })

    if (error) {
      throw error
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error("Error sending reminder email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
