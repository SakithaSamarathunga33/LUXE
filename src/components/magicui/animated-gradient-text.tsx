import { cn } from "@/lib/utils"
import React from "react"

interface AnimatedGradientTextProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      style={{ "--bg-size": "400%" } as React.CSSProperties}
      className={cn(
        "animate-gradient bg-gradient-to-r from-[#C9A96E] via-[#F5E6C8] to-[#B2904E]",
        "bg-[length:var(--bg-size)] bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  )
}
