import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // For demo purposes, use a default user if not authenticated
    const userId = user?.id || "demo-user"
    const userEmail = user?.email || "demo@example.com"

    // Ensure user exists in our database
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: userEmail,
      },
      create: {
        id: userId,
        email: userEmail,
        name: user?.user_metadata?.name || "Demo User",
      },
    })

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { scheduledTime: "asc" },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}
