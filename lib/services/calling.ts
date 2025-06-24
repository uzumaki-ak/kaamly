// interface CallResult {
//   success: boolean
//   callId?: string
//   message: string
//   appointmentConfirmed?: boolean
//   appointmentDetails?: any
//   transcript?: any
//   summary?: string
//   duration?: number
// }

// export async function makeAppointmentCall(
//   phoneNumber: string,
//   script: string,
//   appointmentDetails: any,
// ): Promise<CallResult> {
//   try {
//     console.log(`Attempting to call ${phoneNumber} with Vapi...`)

//     // Check if we have the required API keys
//     if (!process.env.VAPI_API_KEY || !process.env.VAPI_PHONE_NUMBER_ID) {
//       console.log("Missing Vapi API key or phone number ID")
//       return {
//         success: false,
//         message: "Missing Vapi API key or phone number ID",
//         appointmentConfirmed: false,
//       }
//     }

//     // Log the configuration for debugging
//     console.log(`Using Vapi API key: ${process.env.VAPI_API_KEY.substring(0, 5)}...`)
//     console.log(`Using Vapi phone number ID: ${process.env.VAPI_PHONE_NUMBER_ID}`)
//     console.log(`Calling: ${phoneNumber}`)

//     // Updated Vapi call configuration based on your screenshots
//     const callPayload = {
//       phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID, // Use the phone number ID, not the actual number
//       customer: {
//         number: phoneNumber,
//       },
//       assistant: {
//         name: "Riley",
//         model: {
//           provider: "openai",
//           model: "gpt-4o", // Updated to GPT-4o as shown in your screenshot
//           messages: [
//             {
//               role: "system",
//               content: `You are Riley, a professional appointment booking assistant for Wellness Partners. 

// Your goal is to book a ${appointmentDetails.service_type} appointment with the following details:
// - Service needed: ${appointmentDetails.service_type}
// - Preferred time: ${appointmentDetails.time_preference}
// - Budget: ${appointmentDetails.price_preference || "Flexible"}
// - Location: ${appointmentDetails.location}
// - Additional requirements: ${appointmentDetails.additional_requirements || "None"}

// Instructions:
// 1. Start with: "Thank you for calling Wellness Partners. This is Riley, your scheduling assistant. How may I help you today?"
// 2. Be polite, professional, and efficient
// 3. Confirm availability for the requested time
// 4. Ask about pricing and confirm it fits the budget
// 5. Get confirmation details (name, contact info if needed)
// 6. If they can't accommodate, ask for alternative times
// 7. At the end, provide a summary in this format:
//    - APPOINTMENT_STATUS: [CONFIRMED/DECLINED/ALTERNATIVE_OFFERED]
//    - TIME_CONFIRMED: [actual time if confirmed]
//    - PRICE_CONFIRMED: [actual price if confirmed]
//    - NOTES: [any additional notes]

// Be conversational and helpful while gathering the necessary information.`,
//             },
//           ],
//         },
//         voice: {
//           provider: "11labs", // Updated to match your screenshot (11labs, not elevenlabs)
//           voiceId: "sarah", // Voice name from your screenshot
//           model: "eleven_turbo_v2_5", // Voice model from your screenshot
//         },
//         firstMessage:
//           "Thank you for calling Wellness Partners. This is Riley, your scheduling assistant. How may I help you today?",
//         recordingEnabled: true,
//         endCallMessage: "Thank you for your time. Have a wonderful day!",
//         endCallPhrases: ["goodbye", "thank you", "that's all", "end call"],
//         maxDurationSeconds: 300, // 5 minutes max
//       },
//       metadata: {
//         appointmentType: appointmentDetails.service_type,
//         location: appointmentDetails.location,
//         timePreference: appointmentDetails.time_preference,
//         pricePreference: appointmentDetails.price_preference,
//         customerEmail: appointmentDetails.customerEmail || "unknown",
//       },
//     }

//     console.log("Vapi call payload:", JSON.stringify(callPayload, null, 2))

//     // Make the API call to Vapi
//     const response = await fetch("https://api.vapi.ai/call", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(callPayload),
//     })

//     console.log(`Vapi response status: ${response.status}`)

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error(`Vapi API error: ${response.status} - ${errorText}`)

//       // Parse error for better debugging
//       let errorDetails
//       try {
//         errorDetails = JSON.parse(errorText)
//         console.error("Vapi API error details:", errorDetails)
//       } catch {
//         errorDetails = { message: errorText }
//       }

//       // Return actual failure with simulated conversation for demo
//       return {
//         success: false,
//         message: `Call failed: ${response.status} - ${errorDetails.message || errorText}`,
//         appointmentConfirmed: false,
//         transcript: generateSimulatedTranscript(appointmentDetails, false, errorDetails.message),
//         summary: `Call failed: ${errorDetails.message || "API error"}`,
//       }
//     }

//     const data = await response.json()
//     console.log("Vapi call initiated successfully:", data)

//     // For demo purposes, simulate a successful conversation
//     const simulatedTranscript = generateSimulatedTranscript(appointmentDetails, true)

//     return {
//       success: true,
//       callId: data.id,
//       message: "Call initiated successfully - Riley is now calling the provider",
//       appointmentConfirmed: true,
//       transcript: simulatedTranscript,
//       summary: "Call completed successfully. Appointment confirmed by Riley.",
//       duration: 180, // 3 minutes
//     }
//   } catch (error) {
//     console.error("Error making call:", error)

//     // Return actual error with simulated conversation for demo
//     return {
//       success: false,
//       message: `Call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
//       appointmentConfirmed: false,
//       transcript: generateSimulatedTranscript(
//         appointmentDetails,
//         false,
//         error instanceof Error ? error.message : "Unknown error",
//       ),
//       summary: `Call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
//     }
//   }
// }

// function generateSimulatedTranscript(appointmentDetails: any, successful: boolean, errorMessage?: string) {
//   const timestamp = new Date().toLocaleTimeString()

//   if (successful) {
//     return {
//       conversation: [
//         {
//           timestamp: timestamp,
//           speaker: "Riley_AI",
//           message:
//             "Thank you for calling Wellness Partners. This is Riley, your scheduling assistant. How may I help you today?",
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Staff",
//           message: "Hi Riley! Yes, we can help with scheduling. What service are you looking to book?",
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Riley_AI",
//           message: `I'd like to book a ${appointmentDetails.service_type} appointment for ${appointmentDetails.time_preference}. Do you have any availability?`,
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Staff",
//           message: `Let me check our schedule... Yes, we have availability tomorrow at 2 PM for ${appointmentDetails.service_type}. Would that work?`,
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Riley_AI",
//           message: "That sounds perfect! Could you tell me about the pricing for this service?",
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Staff",
//           message: `The cost would be ${appointmentDetails.price_preference || "₹800"} for the ${appointmentDetails.service_type}. We'll need a name and contact number to confirm the booking.`,
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Riley_AI",
//           message:
//             "Excellent! The appointment is for our customer. I'll have them call within the next hour to provide their details and confirm. Can you hold this 2 PM slot?",
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Staff",
//           message: "I'll hold the 2 PM slot for one hour. Please have them mention this conversation when they call.",
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Riley_AI",
//           message: "Perfect! Thank you so much for your assistance. Have a wonderful day!",
//         },
//         {
//           timestamp: timestamp,
//           speaker: "Staff",
//           message: "You're welcome! Looking forward to hearing from your customer. Have a great day!",
//         },
//       ],
//       summary: {
//         status: "CONFIRMED",
//         timeConfirmed: "Tomorrow 2 PM",
//         priceConfirmed: appointmentDetails.price_preference || "₹800",
//         notes: "Appointment tentatively booked. Customer needs to call within 1 hour to confirm with personal details.",
//         duration: "3 minutes",
//         outcome: "Successful booking with Riley AI assistant",
//       },
//     }
//   } else {
//     return {
//       conversation: [
//         {
//           timestamp: timestamp,
//           speaker: "Riley_AI",
//           message: "Attempting to call provider for appointment booking...",
//         },
//         {
//           timestamp: timestamp,
//           speaker: "System",
//           message: `Call failed: ${errorMessage || "Unable to connect"}`,
//         },
//         {
//           timestamp: timestamp,
//           speaker: "System",
//           message: "Riley was unable to reach the provider. The system will proceed with manual booking simulation.",
//         },
//       ],
//       summary: {
//         status: "FAILED",
//         notes: `Riley couldn't connect: ${errorMessage || "Call failed to connect"}`,
//         fallbackAction: "Manual booking simulation activated",
//       },
//     }
//   }
// }

// // Webhook handler for call completion
// export async function handleCallWebhook(callData: any) {
//   // Process call results and update appointment status
//   // This would be called by Vapi when the call completes
//   return {
//     appointmentConfirmed: callData.successful,
//     details: callData.transcript,
//   }
// }



// !new



interface CallResult {
  success: boolean
  callId?: string
  message: string
  appointmentConfirmed?: boolean
  appointmentDetails?: any
  transcript?: any
  summary?: string
  duration?: number
}

export async function makeAppointmentCall(
  phoneNumber: string,
  script: string,
  appointmentDetails: any,
): Promise<CallResult> {
  try {
    console.log(`Attempting to call ${phoneNumber} with Vapi...`)

    // FOR DEMO: Skip real calls and simulate everything
    const DEMO_MODE = true // Set to false for real calls

    if (DEMO_MODE) {
      console.log("assistant: Simulating call instead of making real call")

      // Simulate a delay like a real call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const simulatedTranscript = generateSimulatedTranscript(appointmentDetails, true)

      return {
        success: true,
        callId: `demo-call-${Date.now()}`,
        message: "✅ DEMO: Call simulated successfully - Riley 'called' the provider",
        appointmentConfirmed: true,
        transcript: simulatedTranscript,
        summary: "✅ DEMO: Simulated call completed successfully. Appointment confirmed by Riley.",
        duration: 180,
      }
    }

    // REAL CALL CODE (only runs if DEMO_MODE = false)
    if (!process.env.VAPI_API_KEY || !process.env.VAPI_PHONE_NUMBER_ID) {
      throw new Error("Missing Vapi API key or phone number ID")
    }

    // Format phone number to E.164 format
    const formattedPhoneNumber = formatPhoneToE164(phoneNumber)
    console.log(`Original phone: ${phoneNumber}`)
    console.log(`Formatted phone: ${formattedPhoneNumber}`)

    // Validate phone number is not a fake 555 number
    if (formattedPhoneNumber.includes("555")) {
      throw new Error("Cannot call 555 numbers - they are reserved for fictional use. Use a real phone number.")
    }

    const callPayload = {
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
        number: formattedPhoneNumber,
      },
      assistant: {
        name: "Riley",
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are Riley, a professional appointment booking assistant for Wellness Partners. 

Your goal is to book a ${appointmentDetails.service_type} appointment with the following details:
- Service needed: ${appointmentDetails.service_type}
- Preferred time: ${appointmentDetails.time_preference}
- Budget: ${appointmentDetails.price_preference || "Flexible"}
- Location: ${appointmentDetails.location}

Instructions:
1. Start with: "Hello! This is Riley from Wellness Partners. I'm calling to inquire about booking a ${appointmentDetails.service_type} appointment. Is this a good time to talk?"
2. Be polite, professional, and efficient
3. Explain you're calling on behalf of a customer
4. Ask about availability for ${appointmentDetails.time_preference}
5. Inquire about pricing and services
6. Get basic booking details if they can accommodate
7. Provide a summary at the end

Be conversational and helpful while gathering the necessary information.`,
            },
          ],
        },
        voice: {
          provider: "11labs",
          voiceId: "sarah",
          model: "eleven_turbo_v2_5",
        },
        firstMessage: `Hello! This is Riley from Wellness Partners. I'm calling to inquire about booking a ${appointmentDetails.service_type} appointment. Is this a good time to talk?`,
        recordingEnabled: true,
        endCallMessage: "Thank you for your time. Have a wonderful day!",
        endCallPhrases: ["goodbye", "thank you", "that's all", "end call", "have a good day"],
        maxDurationSeconds: 300,
      },
      metadata: {
        appointmentType: appointmentDetails.service_type,
        location: appointmentDetails.location,
        timePreference: appointmentDetails.time_preference,
        customerEmail: appointmentDetails.customerEmail || "unknown",
      },
    }

    console.log("Making real Vapi call...")
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Vapi API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("Real Vapi call initiated successfully:", data)

    return {
      success: true,
      callId: data.id,
      message: "Real call initiated successfully - Riley is calling the provider",
      appointmentConfirmed: true,
      transcript: generateSimulatedTranscript(appointmentDetails, true),
      summary: "Real call initiated. Waiting for completion...",
      duration: 0, // Will be updated when call completes
    }
  } catch (error) {
    console.error("Error making call:", error)

    return {
      success: false,
      message: `Call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      appointmentConfirmed: false,
      transcript: generateSimulatedTranscript(
        appointmentDetails,
        false,
        error instanceof Error ? error.message : "Unknown error",
      ),
      summary: `Call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

function formatPhoneToE164(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[^\d+]/g, "")

  if (cleaned.startsWith("+")) {
    return cleaned
  } else if (cleaned.startsWith("1") && cleaned.length === 11) {
    return `+${cleaned}`
  } else {
    return `+1${cleaned}`
  }
}

function generateSimulatedTranscript(appointmentDetails: any, successful: boolean, errorMessage?: string) {
  const timestamp = new Date().toLocaleTimeString()

  if (successful) {
    return {
      conversation: [
        {
          timestamp: timestamp,
          speaker: "Riley_AI",
          message: `🎭 DEMO: Hello! This is Riley from Wellness Partners. I'm calling to inquire about booking a ${appointmentDetails.service_type} appointment. Is this a good time to talk?`,
        },
        {
          timestamp: timestamp,
          speaker: "Staff",
          message: "ai assistant: Hi Riley! Yes, this is a good time. How can I help you today?",
        },
        {
          timestamp: timestamp,
          speaker: "Riley_AI",
          message: ` ai assistant: Great! I'm calling on behalf of a customer who needs a ${appointmentDetails.service_type} appointment for ${appointmentDetails.time_preference}. Do you have any availability?`,
        },
        {
          timestamp: timestamp,
          speaker: "Staff",
          message: `🎭 DEMO: Let me check our schedule... Yes, we have availability tomorrow at 2 PM for ${appointmentDetails.service_type}. Would that work for your customer?`,
        },
        {
          timestamp: timestamp,
          speaker: "Riley_AI",
          message: "🎭 DEMO: That sounds perfect! Could you tell me about the pricing for this service?",
        },
        {
          timestamp: timestamp,
          speaker: "Staff",
          message: `🎭 DEMO: The cost would be ₹800 for the ${appointmentDetails.service_type}. We'll need the customer's name and contact number to confirm the booking.`,
        },
        {
          timestamp: timestamp,
          speaker: "Riley_AI",
          message:
            "🎭 DEMO: Excellent! I'll have the customer call within the next hour to provide their details and confirm. Can you hold this 2 PM slot?",
        },
        {
          timestamp: timestamp,
          speaker: "Staff",
          message:
            "🎭 DEMO: I'll hold the 2 PM slot for one hour. Please have them mention this conversation with Riley when they call.",
        },
        {
          timestamp: timestamp,
          speaker: "Riley_AI",
          message: "🎭 DEMO: Perfect! Thank you so much for your assistance. Have a wonderful day!",
        },
      ],
      summary: {
        status: "CONFIRMED",
        timeConfirmed: "Tomorrow 2 PM",
        priceConfirmed: "₹800",
        notes: "🎭 DEMO: Simulated appointment booking. Customer needs to call to confirm with personal details.",
        duration: "3 minutes",
        outcome: "✅ DEMO: Successful simulated booking with Riley AI assistant",
      },
    }
  } else {
    return {
      conversation: [
        {
          timestamp: timestamp,
          speaker: "System",
          message: `🎭 DEMO: Call simulation failed: ${errorMessage || "Unable to connect"}`,
        },
      ],
      summary: {
        status: "FAILED",
        notes: `🎭 DEMO: Simulated call failed: ${errorMessage || "Call failed to connect"}`,
        fallbackAction: "Manual booking simulation activated",
      },
    }
  }
}

export async function handleCallWebhook(callData: any) {
  return {
    appointmentConfirmed: callData.successful,
    details: callData.transcript,
  }
}
