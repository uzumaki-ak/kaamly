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
      appointmentDetails,
      callReason = "greeting",
      phoneNumber: directPhoneNumber,
    } = await request.json()

    console.log("📞 Personal calling request received:", { userEmail, callReason, directPhoneNumber })

    let phoneNumber = directPhoneNumber

    // If no direct phone number, get from user config
    if (!phoneNumber) {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          personalCallingConfig: true,
        },
      })

      if (!user?.personalCallingConfig?.phoneNumber) {
        return NextResponse.json({ success: false, error: "No phone number configured" }, { status: 400 })
      }

      phoneNumber = user.personalCallingConfig.phoneNumber
    }

    console.log(`📞 Using phone number: ${phoneNumber}`)

    // Create call using Python script
    const callResult = await makeOmniDimensionCall(phoneNumber, appointmentDetails, callReason, userEmail)

    // Save call log
    try {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      })

      if (user) {
        await prisma.personalCallLog.create({
          data: {
            userId: user.id,
            phoneNumber: phoneNumber,
            callReason: callReason,
            appointmentId: appointmentDetails?.appointmentId,
            omnidimCallId: callResult.callId,
            status: callResult.success ? "initiated" : "failed",
            callData: appointmentDetails || {},
            errorMessage: callResult.success ? null : callResult.error,
          },
        })
      }
    } catch (dbError) {
      console.error("❌ Database error (non-critical):", dbError)
    }

    return NextResponse.json({
      success: callResult.success,
      message: callResult.message,
      callId: callResult.callId,
      simulation: false,
    })
  } catch (error) {
    console.error("❌ Personal call error:", error)
    return NextResponse.json({ success: false, error: "Call failed" }, { status: 500 })
  }
}

async function makeOmniDimensionCall(
  phoneNumber: string,
  appointmentDetails: any,
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

    console.log(`🔥 Making REAL OmniDimension call via Python script to ${formattedPhoneNumber}`)
    console.log(`📞 Using Agent ID: ${OMNIDIM_AGENT_ID}`)

    // Get the path to the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "omnidim-caller.py")

    // Run the Python script with arguments
    const command = `python "${scriptPath}" "${formattedPhoneNumber}" "${OMNIDIM_AGENT_ID}" "${callReason}" "${userEmail}"`

    console.log(`🐍 Running Python command: ${command}`)

    const { stdout, stderr } = await execAsync(command, {
      env: { ...process.env }, // Pass all environment variables including OMNIDIM_API_KEY
      timeout: 30000, // 30 second timeout
    })

    if (stderr) {
      console.error("❌ Python script stderr:", stderr)
    }

    console.log("🐍 Python script output:", stdout)

    // Parse the JSON output from Python script
    const result = JSON.parse(stdout.trim())

    if (result.success) {
      console.log(`✅ REAL OMNIDIMENSION CALL INITIATED via Python!`)
      console.log(`📞 Call ID: ${result.call_id}`)

      return {
        success: true,
        callId: result.call_id,
        message: `🔥 REAL CALL: Saloni AI is calling ${formattedPhoneNumber} RIGHT NOW via OmniDimension! Check your phone! 📞`,
        error: null,
      }
    } else {
      console.error(`❌ Python script failed: ${result.error}`)
      return {
        success: false,
        callId: null,
        message: `❌ Call failed: ${result.error}`,
        error: result.error,
      }
    }
  } catch (error) {
    console.error("❌ Python script execution failed:", error)
    return {
      success: false,
      callId: null,
      message: `❌ Call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
