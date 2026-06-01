"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { ShimmerButton } from "@/components/magicui/shimmer-button"

gsap.registerPlugin(ScrollTrigger)

type Look = {
  src: string
  name: string
  cat: string
  no: string
  href: string
  pos: string // object-position — keeps the subject framed on narrow screens
}

const LOOKS: Look[] = [
  { src: "/images/hero-main.png", name: "Ember Silk", cat: "Eveningwear", no: "01", href: "/shop?category=Women", pos: "78% 50%" },
  { src: "/images/hero-aside.png", name: "Desert Trench", cat: "Outerwear", no: "02", href: "/shop?category=Women", pos: "60% 50%" },
  { src: "/images/look-01.png", name: "Tailored Noir", cat: "Menswear", no: "03", href: "/shop?category=Men", pos: "72% 50%" },
]

const N = LOOKS.length

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const layers = useRef<(HTMLDivElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const section = sectionRef.current
      const els = layers.current.filter(Boolean) as HTMLDivElement[]
      if (!section || els.length !== N) return

      // Crossfade full-bleed backgrounds across scroll progress 0→1
      const render = (p: number) => {
        const pos = p * (N - 1)
        els.forEach((el, i) => {
          const d = Math.abs(i - pos)
          gsap.set(el, {
            opacity: Math.max(0, 1 - d),
            scale: 1 + Math.min(d, 1) * 0.09, // incoming image eases out of a slow zoom
            zIndex: i,
          })
        })
        const idx = Math.round(pos)
        setActive((prev) => (prev === idx ? prev : idx))
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      }

      render(0)

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
        invalidateOnRefresh: true,
      })
    },
    { scope: sectionRef },
  )

  /* ── Pinned full-bleed background gallery ───────────────── */
  return (
    <section
      ref={sectionRef}
      style={{ height: `${N * 90}vh`, marginTop: "calc(-1 * var(--nav-h))" }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#17120d]">
        {/* Stacked background images — opening zoom + fade on load */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {LOOKS.map((look, i) => (
            <div
              key={look.src}
              ref={(el) => { layers.current[i] = el }}
              className="absolute inset-0 will-change-[opacity,transform]"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <img
                src={look.src}
                alt={look.name}
                loading="eager"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: look.pos }}
              />
            </div>
          ))}
        </motion.div>

        {/* Legibility scrims */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, rgba(13,11,8,.62) 0%, rgba(13,11,8,.22) 42%, transparent 68%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgba(13,11,8,.6) 0%, transparent 38%, rgba(13,11,8,.28) 100%)" }}
        />

        {/* ── Foreground UI ───────────────────────────────── */}
        {/* Top-left label */}
        <motion.div
          className="absolute left-7 md:left-[6vw] z-30 font-mono text-[10.5px] tracking-[.2em] uppercase text-white/75"
          style={{ top: "calc(var(--nav-h) + 28px)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Spring / Summer 2026 — The Lookbook
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="absolute left-7 md:left-[6vw] z-30 font-serif leading-[0.95] tracking-[-0.02em] text-white max-w-[14ch]"
          style={{ top: "calc(var(--nav-h) + 64px)", fontSize: "clamp(44px,7vw,118px)" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          The Art of <AnimatedGradientText className="font-serif italic">Movement</AnimatedGradientText>
        </motion.h1>

        {/* Bottom-left dynamic caption + CTA */}
        <div className="absolute left-7 md:left-[6vw] bottom-24 md:bottom-14 z-30 max-w-[80vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-mono text-[10px] tracking-[0.3em] text-white/70 mb-2">
                {LOOKS[active].cat.toUpperCase()}
              </div>
              <div className="font-serif text-[clamp(30px,4.4vw,56px)] leading-none text-white mb-5">
                {LOOKS[active].name}
              </div>
              <ShimmerButton
                background="#C9A96E"
                shimmerColor="rgba(255,255,255,0.95)"
                shimmerSize="2px"
                className="px-7 py-3 font-mono text-[11px] tracking-widest text-luxe-ink"
              >
                <Link href={LOOKS[active].href}>SHOP THE LOOK</Link>
              </ShimmerButton>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom-right progress */}
        <div className="absolute right-7 md:right-[6vw] bottom-24 md:bottom-14 z-30 flex flex-col items-end gap-3">
          <div className="font-serif text-[clamp(28px,3.4vw,46px)] leading-none text-white/90">
            {LOOKS[active].no}
            <span className="text-white/45 text-[0.6em] align-top"> / 0{N}</span>
          </div>
          <div className="w-[120px] md:w-[180px] h-px bg-white/25 overflow-hidden">
            <div ref={barRef} className="h-full w-full bg-luxe-gold origin-left" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>

        {/* Scroll hint — fades once you start */}
        <AnimatePresence>
          {active === 0 && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 bottom-7 z-30 hidden md:flex flex-col items-center gap-2 text-white/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <span className="font-mono text-[9px] tracking-[.3em]">SCROLL TO EXPLORE</span>
              <span className="w-px h-7 bg-white/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
