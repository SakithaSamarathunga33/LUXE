"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface PhotoProps {
  src: string
  alt?: string
  className?: string
  eager?: boolean
  dark?: boolean
}

export function Photo({ src, alt = "", className, eager = false, dark = false }: PhotoProps) {
  const [status, setStatus] = useState<"load" | "ok" | "err">("load")
  const [show, setShow] = useState(eager)
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => { setStatus("load") }, [src])

  useEffect(() => {
    if (eager) return
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect() } },
      { rootMargin: "300px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [eager])

  useEffect(() => {
    const img = imgRef.current
    if (!img || !show) return
    if (img.complete) setStatus(img.naturalWidth > 0 ? "ok" : "err")
  }, [show, src])

  return (
    <div
      ref={wrapRef}
      className={cn("relative overflow-hidden w-full h-full", dark ? "bg-[#17120d]" : "bg-[#ece6dc]", className)}
    >
      {status !== "ok" && (
        <div className={cn("skeleton absolute inset-0", dark && "bg-[#221b14]")} />
      )}
      {show && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: status === "ok" ? 1 : 0, transition: "opacity 0.5s ease" }}
          onLoad={() => setStatus("ok")}
          onError={() => setStatus("err")}
        />
      )}
      {status === "err" && (
        <div className="absolute inset-0 flex items-center justify-center text-luxe-muted/40 text-4xl font-serif">
          L
        </div>
      )}
    </div>
  )
}
