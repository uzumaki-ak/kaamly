import { type NextRequest, NextResponse } from "next/server"
import { executeTask } from "@/lib/services/task-executor"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userInput, userEmail } = await request.json()

    if (!userInput) {
      return NextResponse.json({ error: "User input is required" }, { status: 400 })
    }

    // Get user from Supabase auth
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // Use provided email or fallback to user email or demo
    const userId = user?.id || "demo-user"
    const finalUserEmail = userEmail || user?.email || "demo@example.com"

    console.log(`Processing task for user: ${userId}, email: ${finalUserEmail}`)

    // Ensure user exists in our database
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: finalUserEmail,
        name: user?.user_metadata?.name || "Demo User",
      },
      create: {
        id: userId,
        email: finalUserEmail,
        name: user?.user_metadata?.name || "Demo User",
      },
    })

    // Execute the task
    const result = await executeTask(userId, finalUserEmail, userInput)

    return NextResponse.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        steps: [],
      },
      { status: 500 },
    )
  }
}
