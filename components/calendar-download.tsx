// "use client"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "lucide-react"
// import { useState } from "react"

// interface CalendarDownloadProps {
//   appointmentDetails: {
//     id: string
//     type: string
//     providerName: string
//     location: string
//     scheduledTime: string
//     duration?: number
//     price?: string
//   }
// }

// export function CalendarDownload({ appointmentDetails }: CalendarDownloadProps) {
//   const [isGenerating, setIsGenerating] = useState(false)

//   const generateICS = () => {
//     setIsGenerating(true)

//     try {
//       const startDate = new Date(appointmentDetails.scheduledTime)
//       const endDate = new Date(startDate.getTime() + (appointmentDetails.duration || 60) * 60000)

//       // Format date in iCalendar format: YYYYMMDDTHHMMSSZ
//       const formatDate = (date: Date) => {
//         return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+/g, "")
//       }

//       // Properly formatted iCalendar file with CRLF line endings
//       const icsContent = [
//         "BEGIN:VCALENDAR",
//         "VERSION:2.0",
//         "PRODID:-//Task Execution App//EN",
//         "CALSCALE:GREGORIAN",
//         "METHOD:PUBLISH",
//         "BEGIN:VEVENT",
//         `UID:${appointmentDetails.id}@taskapp.com`,
//         `DTSTAMP:${formatDate(new Date())}`,
//         `DTSTART:${formatDate(startDate)}`,
//         `DTEND:${formatDate(endDate)}`,
//         `SUMMARY:${appointmentDetails.type} Appointment - ${appointmentDetails.providerName}`,
//         `DESCRIPTION:Appointment Details\\n\\nService: ${appointmentDetails.type}\\nProvider: ${appointmentDetails.providerName}\\nLocation: ${appointmentDetails.location}\\nPrice: ${appointmentDetails.price || "TBD"}\\n\\nBooked via Task Execution App`,
//         `LOCATION:${appointmentDetails.location}`,
//         "STATUS:CONFIRMED",
//         "TRANSP:OPAQUE",
//         "SEQUENCE:0",
//         "END:VEVENT",
//         "END:VCALENDAR",
//       ].join("\r\n")

//       // Create a blob and download link
//       const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
//       const url = URL.createObjectURL(blob)
//       const link = document.createElement("a")
//       link.href = url
//       link.setAttribute("download", `${appointmentDetails.type}-appointment.ics`)
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       URL.revokeObjectURL(url)
//     } catch (error) {
//       console.error("Error generating calendar file:", error)
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   return (
//     <Button
//       onClick={generateICS}
//       disabled={isGenerating}
//       variant="outline"
//       className="flex items-center gap-2"
//       size="sm"
//     >
//       <Calendar className="h-4 w-4" />
//       {isGenerating ? "Generating..." : "Download Calendar File (.ics)"}
//     </Button>
//   )
// }

// !new ui 

"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { useState } from "react"

interface CalendarDownloadProps {
  appointmentDetails: {
    id: string
    type: string
    providerName: string
    location: string
    scheduledTime: string
    duration?: number
    price?: string
  }
}

export function CalendarDownload({ appointmentDetails }: CalendarDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateICS = () => {
    setIsGenerating(true)

    try {
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

      // Create a blob and download link
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${appointmentDetails.type}-appointment.ics`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating calendar file:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generateICS}
      disabled={isGenerating}
      variant="outline"
      className="flex items-center gap-2 w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
      size="sm"
    >
      <Calendar className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Download Calendar File (.ics)"}
    </Button>
  )
}
