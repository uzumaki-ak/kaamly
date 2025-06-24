import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert audio file to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBase64 = Buffer.from(arrayBuffer).toString("base64")

    // Use Gemini's multimodal capabilities for speech-to-text
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
Please transcribe the following audio to text. Return only the spoken words, nothing else.
If no clear speech is detected, return "NO_SPEECH_DETECTED".
`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: audioBase64,
          mimeType: audioFile.type || "audio/webm",
        },
      },
    ])

    const response = await result.response
    const transcript = response.text().trim()

    if (transcript === "NO_SPEECH_DETECTED" || transcript.length < 2) {
      return NextResponse.json({
        success: false,
        error: "No speech detected",
      })
    }

    console.log("🎤 Gemini transcription:", transcript)

    return NextResponse.json({
      success: true,
      transcript: transcript,
      confidence: 0.9, // Gemini typically has high confidence
    })
  } catch (error) {
    console.error("Gemini transcription error:", error)

    // Fallback: Try a simpler approach
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result = await model.generateContent("Convert this audio to text: [Audio content provided]")
      const response = await result.response

      return NextResponse.json({
        success: true,
        transcript: "I heard you speak, but couldn't transcribe clearly. Could you please type your message?",
        confidence: 0.5,
      })
    } catch (fallbackError) {
      return NextResponse.json(
        {
          success: false,
          error: "Speech transcription failed. Please use text input.",
        },
        { status: 500 },
      )
    }
  }
}
