import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const {
      userEmail = "anikeshuzumaki@gmail.com",
      appointmentId,
      providerPhoneNumber,
      callReason = "booking_confirmation",
    } = await request.json()

    console.log("📞 Booking confirmation call request:", { userEmail, appointmentId, providerPhoneNumber })

    // Get appointment details
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
      },
    })

    if (!appointment) {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 })
    }

    // Create booking context for Omni
    const bookingContext = {
      customerName: appointment.user.name || "Anikesh Kumar",
      customerEmail: appointment.user.email,
      customerPhone: appointment.user.phone || "+918744003734",
      appointmentType: appointment.type,
      providerName: appointment.providerName,
      appointmentDate: appointment.scheduledTime.toLocaleDateString(),
      appointmentTime: appointment.scheduledTime.toLocaleTimeString(),
      location: appointment.location,
      address: appointment.address,
      price: appointment.price,
      status: appointment.status,
      notes: appointment.notes,
    }

    console.log("📋 Booking context:", bookingContext)

    // Make call with booking context
    const callResult = await makeBookingConfirmationCall(providerPhoneNumber, bookingContext, callReason, userEmail)

    // Save call log
    try {
      await prisma.personalCallLog.create({
        data: {
          userId: appointment.userId,
          phoneNumber: providerPhoneNumber,
          callReason: callReason,
          appointmentId: appointmentId,
          omnidimCallId: callResult.callId,
          status: callResult.success ? "initiated" : "failed",
          callData: bookingContext,
          errorMessage: callResult.success ? null : callResult.error,
        },
      })
    } catch (dbError) {
      console.error("❌ Database error (non-critical):", dbError)
    }

    return NextResponse.json({
      success: callResult.success,
      message: callResult.message,
      callId: callResult.callId,
      bookingContext,
    })
  } catch (error) {
    console.error("❌ Booking confirmation call error:", error)
    return NextResponse.json({ success: false, error: "Call failed" }, { status: 500 })
  }
}

async function makeBookingConfirmationCall(
  phoneNumber: string,
  bookingContext: any,
  callReason: string,
  userEmail: string,
) {
  try {
    const OMNIDIM_AGENT_ID = process.env.OMNIDIM_AGENT_ID

    if (!OMNIDIM_AGENT_ID) {
      throw new Error("❌ OMNIDIM_AGENT_ID missing in .env")
    }

    // Format phone number to E.164 format
    let formattedPhoneNumber = phoneNumber
    if (!formattedPhoneNumber.startsWith("+")) {
      formattedPhoneNumber = formattedPhoneNumber.replace(/[\s\-()]/g, "")
      if (formattedPhoneNumber.length === 10) {
        formattedPhoneNumber = `+91${formattedPhoneNumber}`
      }
    }

    console.log(`🔥 Making BOOKING CONFIRMATION call to ${formattedPhoneNumber}`)

    // Get the path to the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "booking-confirmation-caller.py")

    // Run the Python script with booking context
    const command = `python "${scriptPath}" "${formattedPhoneNumber}" "${OMNIDIM_AGENT_ID}" "${JSON.stringify(bookingContext).replace(/"/g, '\\"')}" "${userEmail}"`

    console.log(`🐍 Running booking confirmation command`)

    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env },
      timeout: 30000,
    })

    if (stderr) {
      console.error("❌ Python script stderr:", stderr)
    }

    console.log("🐍 Python script output:", stdout)

    const result = JSON.parse(stdout.trim())

    if (result.success) {
      console.log(`✅ BOOKING CONFIRMATION CALL INITIATED!`)
      console.log(`📞 Call ID: ${result.call_id}`)

      return {
        success: true,
        callId: result.call_id,
        message: `🔥 REAL CALL: Omni is calling ${formattedPhoneNumber} to confirm booking with ${bookingContext.providerName}! 📞`,
        error: null,
      }
    } else {
      console.error(`❌ Booking confirmation call failed: ${result.error}`)
      return {
        success: false,
        callId: null,
        message: `❌ Call failed: ${result.error}`,
        error: result.error,
      }
    }
  } catch (error) {
    console.error("❌ Booking confirmation call execution failed:", error)
    return {
      success: false,
      callId: null,
      message: `❌ Call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
