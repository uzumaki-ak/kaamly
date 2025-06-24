import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { jsPDF } from "jspdf"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const callLogId = params.id

    const callLog = await prisma.callLog.findUnique({
      where: { id: callLogId },
      include: {
        user: true,
      },
    })

    if (!callLog) {
      return NextResponse.json({ error: "Call log not found" }, { status: 404 })
    }

    // Generate PDF
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text("Call Log Report", 20, 20)

    // Call details
    doc.setFontSize(12)
    doc.text(`Call ID: ${callLog.id}`, 20, 40)
    doc.text(`Phone Number: ${callLog.phoneNumber}`, 20, 50)
    doc.text(`Provider: ${callLog.providerName || "Unknown"}`, 20, 60)
    doc.text(`Date: ${callLog.createdAt.toLocaleString()}`, 20, 70)
    doc.text(`Status: ${callLog.status}`, 20, 80)
    doc.text(`Duration: ${callLog.callDuration ? `${callLog.callDuration}s` : "N/A"}`, 20, 90)

    // Summary
    if (callLog.summary) {
      doc.text("Summary:", 20, 110)
      const summaryLines = doc.splitTextToSize(callLog.summary, 170)
      doc.text(summaryLines, 20, 120)
    }

    // Transcript
    if (callLog.transcript) {
      let yPosition = 150
      doc.text("Conversation Transcript:", 20, yPosition)
      yPosition += 10

      const transcript = callLog.transcript as any
      if (transcript.conversation) {
        transcript.conversation.forEach((msg: any, index: number) => {
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }

          doc.setFont(undefined, "bold")
          doc.text(`${msg.speaker} (${msg.timestamp}):`, 20, yPosition)
          yPosition += 7

          doc.setFont(undefined, "normal")
          const messageLines = doc.splitTextToSize(msg.message, 170)
          doc.text(messageLines, 20, yPosition)
          yPosition += messageLines.length * 5 + 5
        })
      }
    }

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="call-log-${callLogId}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating call log PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
