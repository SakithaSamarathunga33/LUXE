"use client"

import { AnimatePresence, motion, useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  yOffset?: number
  inViewMargin?: string
  blur?: string
  inView?: boolean
}

export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  yOffset = 8,
  inViewMargin = "-50px",
  blur = "6px",
  inView: _inView,
}: BlurFadeProps) {
  const ref = useRef(null)
  const inViewResult = useInView(ref, { once: true })

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ y: yOffset, opacity: 0, filter: `blur(${blur})` }}
        animate={
          inViewResult
            ? { y: 0, opacity: 1, filter: "blur(0px)" }
            : { y: yOffset, opacity: 0, filter: `blur(${blur})` }
        }
        transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
