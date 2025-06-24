// import { GoogleGenerativeAI } from "@google/generative-ai"

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

// export async function parseUserRequest(userInput: string) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//   const prompt = `
// Parse this user request and extract structured information. Return ONLY valid JSON with no additional text.

// User request: "${userInput}"

// Extract these fields:
// - task: type of task (book_appointment, find_service, make_reservation, etc.)
// - service_type: what they're looking for (salon, barber, restaurant, spa, etc.)
// - location: where they want the service (city, area, "near me")
// - time_preference: when they want it (today, tomorrow, this week, specific date/time)
// - price_preference: budget constraints (cheap, under X amount, etc.)
// - additional_requirements: any special requests
// - contact_preference: how they want to be contacted (email, phone, etc.)

// Example response:
// {
//   "task": "book_appointment",
//   "service_type": "salon",
//   "location": "Delhi",
//   "time_preference": "this Friday",
//   "price_preference": "under 500",
//   "additional_requirements": "hair cut and styling",
//   "contact_preference": "email"
// }
// `

//   try {
//     const result = await model.generateContent(prompt)
//     const response = await result.response
//     const text = response.text()

//     // Clean the response to extract JSON
//     const jsonMatch = text.match(/\{[\s\S]*\}/)
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0])
//     }

//     throw new Error("No valid JSON found in response")
//   } catch (error) {
//     console.error("Error parsing user request:", error)
//     throw error
//   }
// }

// export async function generateCallScript(appointmentDetails: any) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//   const prompt = `
// Generate a professional phone call script for booking an appointment. Keep it concise and natural.

// Appointment details:
// - Service: ${appointmentDetails.service_type}
// - Location: ${appointmentDetails.location}
// - Time preference: ${appointmentDetails.time_preference}
// - Budget: ${appointmentDetails.price_preference}

// Create a script that:
// 1. Introduces the caller politely
// 2. States the service needed
// 3. Asks for availability
// 4. Confirms pricing
// 5. Books the appointment
// 6. Gets confirmation details

// Return as JSON with "script" field containing the text.
// `

//   try {
//     const result = await model.generateContent(prompt)
//     const response = await result.response
//     const text = response.text()

//     const jsonMatch = text.match(/\{[\s\S]*\}/)
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0])
//     }

//     return { script: text }
//   } catch (error) {
//     console.error("Error generating call script:", error)
//     throw error
//   }
// }


// !new gemini 

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function parseUserRequest(userInput: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Parse this user request and extract structured information. Return ONLY valid JSON with no additional text.

User request: "${userInput}"

Extract these fields:
- task: type of task (book_appointment, find_service, make_reservation, etc.)
- service_type: what they're looking for (salon, barber, restaurant, spa, hospital, clinic, etc.)
- location: where they want the service (city, area, "near me")
- time_preference: when they want it (today, tomorrow, this week, specific date/time)
- price_preference: budget constraints (cheap, under X amount, etc.)
- additional_requirements: any special requests
- contact_preference: how they want to be contacted (email, phone, etc.)

Important: For service_type, use specific terms like:
- "hospital" for medical emergencies or major medical services
- "clinic" for routine medical checkups or minor treatments
- "salon" for hair styling, beauty treatments
- "barber" for haircuts, shaving
- "spa" for massage, wellness treatments
- "restaurant" for dining
- "gym" for fitness

Example response:
{
  "task": "book_appointment",
  "service_type": "hospital",
  "location": "Delhi Dwarka",
  "time_preference": "tomorrow",
  "price_preference": "under 2000",
  "additional_requirements": "emergency consultation",
  "contact_preference": "email"
}
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])

      // Validate and clean the parsed data
      return {
        task: parsed.task || "book_appointment",
        service_type: parsed.service_type || "service",
        location: parsed.location || "unknown location",
        time_preference: parsed.time_preference || "flexible",
        price_preference: parsed.price_preference || "flexible",
        additional_requirements: parsed.additional_requirements || null,
        contact_preference: parsed.contact_preference || "email",
      }
    }

    throw new Error("No valid JSON found in response")
  } catch (error) {
    console.error("Error parsing user request:", error)

    // Fallback parsing for common patterns
    const fallback = {
      task: "book_appointment",
      service_type: extractServiceType(userInput),
      location: extractLocation(userInput),
      time_preference: extractTimePreference(userInput),
      price_preference: extractPricePreference(userInput),
      additional_requirements: null,
      contact_preference: "email",
    }

    console.log("Using fallback parsing:", fallback)
    return fallback
  }
}

// Fallback extraction functions
function extractServiceType(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("hospital") || lower.includes("emergency") || lower.includes("doctor")) return "hospital"
  if (lower.includes("clinic") || lower.includes("checkup") || lower.includes("medical")) return "clinic"
  if (lower.includes("salon") || lower.includes("beauty") || lower.includes("hair styling")) return "salon"
  if (lower.includes("barber") || lower.includes("haircut") || lower.includes("shave")) return "barber"
  if (lower.includes("spa") || lower.includes("massage") || lower.includes("wellness")) return "spa"
  if (lower.includes("restaurant") || lower.includes("food") || lower.includes("dining")) return "restaurant"
  if (lower.includes("gym") || lower.includes("fitness") || lower.includes("workout")) return "gym"

  return "service"
}

function extractLocation(input: string): string {
  const lower = input.toLowerCase()

  // Common location patterns
  if (lower.includes("near me") || lower.includes("nearby")) return "near me"
  if (lower.includes("delhi")) return "Delhi"
  if (lower.includes("dwarka")) return "Dwarka, Delhi"
  if (lower.includes("mumbai")) return "Mumbai"
  if (lower.includes("bangalore")) return "Bangalore"

  // Extract "near [location]" or "in [location]"
  const nearMatch = input.match(/near\s+([^,.\n]+)/i)
  if (nearMatch) return nearMatch[1].trim()

  const inMatch = input.match(/in\s+([^,.\n]+)/i)
  if (inMatch) return inMatch[1].trim()

  return "unknown location"
}

function extractTimePreference(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("today")) return "today"
  if (lower.includes("tomorrow")) return "tomorrow"
  if (lower.includes("this week")) return "this week"
  if (lower.includes("next week")) return "next week"
  if (lower.includes("friday")) return "Friday"
  if (lower.includes("weekend")) return "weekend"

  return "flexible"
}

function extractPricePreference(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("cheap") || lower.includes("budget")) return "cheap"
  if (lower.includes("under")) {
    const match = input.match(/under\s*₹?(\d+)/i)
    if (match) return `under ₹${match[1]}`
  }

  return "flexible"
}

export async function generateCallScript(appointmentDetails: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Generate a professional phone call script for booking an appointment. Keep it concise and natural.

Appointment details:
- Service: ${appointmentDetails.service_type}
- Location: ${appointmentDetails.location}
- Time preference: ${appointmentDetails.time_preference}
- Budget: ${appointmentDetails.price_preference}

Create a script that:
1. Introduces the caller politely
2. States the service needed
3. Asks for availability
4. Confirms pricing
5. Books the appointment
6. Gets confirmation details

Return as JSON with "script" field containing the text.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return { script: text }
  } catch (error) {
    console.error("Error generating call script:", error)

    // Fallback script
    return {
      script: `Hello, this is Riley from Wellness Partners. I'm calling to book a ${appointmentDetails.service_type} appointment for ${appointmentDetails.time_preference}. Do you have any availability? We're looking for something ${appointmentDetails.price_preference}. Thank you!`,
    }
  }
}
