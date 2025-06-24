"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export function OmnidimNavLink() {
  return (
    <Link href="/omnidim">
      <Button
        variant="outline"
        className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300"
      >
        <Phone className="h-4 w-4 mr-2" />
        Omnidim AI
      </Button>
    </Link>
  )
}
