"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PhoneCall } from "lucide-react"

export function PersonalCallingNavLink() {
  return (
    <Link href="/personal-calling">
      <Button
        variant="outline"
        className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300"
      >
        <PhoneCall className="h-4 w-4 mr-2" />
        Personal Calls
      </Button>
    </Link>
  )
}
