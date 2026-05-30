"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QtyStepperProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  className?: string
}

export function QtyStepper({ value, onChange, min = 1, max = 99, className }: QtyStepperProps) {
  return (
    <div className={cn("inline-flex items-center border border-luxe-line h-[46px]", className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-11 h-full flex items-center justify-center hover:bg-luxe-paper transition-colors"
        aria-label="decrease"
      >
        <Minus size={15} />
      </button>
      <span className="w-10 text-center font-mono text-sm">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-11 h-full flex items-center justify-center hover:bg-luxe-paper transition-colors"
        aria-label="increase"
      >
        <Plus size={15} />
      </button>
    </div>
  )
}
