import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { userPhone, userName, userEmail = "anikeshuzumaki@gmail.com" } = await request.json()

    if (!userPhone) {
      return NextResponse.json({ success: false, error: "Phone number required" }, { status: 400 })
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName || userEmail.split("@")[0],
          phone: userPhone,
        },
      })
    } else {
      // Update user's phone number
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          phone: userPhone,
          name: userName || user.name,
        },
      })
    }

    // Save personal calling configuration
    const personalConfig = await prisma.personalCallingConfig.upsert({
      where: { userId: user.id },
      update: {
        phoneNumber: userPhone,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        phoneNumber: userPhone,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      config: personalConfig,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      message: "Personal calling configured successfully!",
    })
  } catch (error) {
    console.error("❌ Personal calling setup error:", error)
    return NextResponse.json({ success: false, error: "Setup failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail") || "anikeshuzumaki@gmail.com"

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        personalCallingConfig: true,
      },
    })

    return NextResponse.json({
      success: true,
      config: user?.personalCallingConfig,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          }
        : null,
      isConfigured: !!user?.personalCallingConfig?.phoneNumber,
    })
  } catch (error) {
    console.error("❌ Get personal calling config error:", error)
    return NextResponse.json({ success: false, error: "Failed to get config" }, { status: 500 })
  }
}
