"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

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

      // Smoothstep easing gives each look a longer "hold" and a quicker,
      // more cinematic blend through the middle of the crossfade.
      const ease = (d: number) => {
        const t = Math.min(Math.max(1 - d, 0), 1)
        return t * t * (3 - 2 * t)
      }

      // Crossfade full-bleed backgrounds across scroll progress 0→1
      const render = (p: number) => {
        const pos = p * (N - 1)
        els.forEach((el, i) => {
          const d = Math.abs(i - pos)
          gsap.set(el, {
            opacity: ease(d),
            scale: 1 + Math.min(d, 1) * 0.09, // incoming image eases out of a slow zoom
            zIndex: i,
          })
        })
        const idx = Math.round(pos)
        setActive((prev) => (prev === idx ? prev : idx))
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      }

      render(0)

      // Target progress comes straight from scroll; the rendered progress
      // eases toward it every tick, giving the pinned gallery a smooth,
      // slightly trailing follow instead of snapping 1:1 to the scrollbar.
      const state = { current: 0, target: 0 }

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => { state.target = self.progress },
        onRefresh: (self) => {
          state.target = self.progress
          state.current = self.progress
          render(self.progress)
        },
        invalidateOnRefresh: true,
      })

      const tick = () => {
        const delta = state.target - state.current
        state.current += Math.abs(delta) < 0.0006 ? delta : delta * 0.14
        render(state.current)
      }
      gsap.ticker.add(tick)

      return () => gsap.ticker.remove(tick)
    },
    { scope: sectionRef },
  )

  /* ── Pinned full-bleed background gallery ───────────────── */
  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{ height: `${N * 90}vh`, marginTop: "calc(-1 * var(--nav-h))" }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
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
          style={{ background: "linear-gradient(90deg, rgb(20 16 24 / .7) 0%, rgb(20 16 24 / .25) 45%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgb(20 16 24 / .85) 0%, transparent 42%, rgb(20 16 24 / .35) 100%)" }}
        />

        {/* ── Foreground UI ───────────────────────────────── */}
        <div
          className="absolute left-5 md:left-[6vw] right-5 z-30 flex flex-col items-start gap-5"
          style={{ top: "calc(var(--nav-h) + 40px)" }}
        >
          <motion.span
            className="chip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="size-1.5 rounded-full" style={{ background: "var(--silk)" }} />
            Spring–Summer 2026 lookbook
          </motion.span>

          <motion.h1
            className="font-display font-bold text-white leading-[0.86] tracking-[-0.05em] max-w-[11ch]"
            style={{ fontSize: "clamp(52px,9vw,148px)", fontVariationSettings: '"wdth" 78' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            The art of movement
          </motion.h1>
        </div>

        {/* Bottom-left caption card + CTA */}
        <div className="absolute left-5 md:left-[6vw] bottom-24 md:bottom-12 z-30">
          <div className="rounded-[28px] border border-white/12 bg-[rgb(20_16_24/0.45)] backdrop-blur-xl p-5 pr-6 md:p-6 md:pr-8 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="text-sm text-white/65">{LOOKS[active].cat}</div>
                <div className="font-display font-semibold text-[clamp(28px,3.6vw,44px)] leading-none tracking-[-0.03em] text-white mt-1.5 mb-5">
                  {LOOKS[active].name}
                </div>
              </motion.div>
            </AnimatePresence>
            <Link href={LOOKS[active].href} className="btn-silk">
              Shop the look
            </Link>
          </div>
        </div>

        {/* Bottom-right progress */}
        <div className="absolute right-5 md:right-[6vw] bottom-24 md:bottom-14 z-30 hidden sm:flex flex-col items-end gap-3">
          <div className="font-display text-white tabular-nums text-[clamp(26px,3vw,40px)] leading-none tracking-[-0.03em]">
            {LOOKS[active].no}
            <span className="text-white/40 text-[0.55em] align-top ml-1">/ 0{N}</span>
          </div>
          <div className="w-[140px] md:w-[200px] h-1 rounded-full bg-white/15 overflow-hidden">
            <div ref={barRef} className="h-full w-full rounded-full origin-left" style={{ transform: "scaleX(0)", background: "var(--silk)" }} />
          </div>
        </div>

        {/* Scroll hint — a mouse with a travelling wheel; fades once you start */}
        <AnimatePresence>
          {active === 0 && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 hidden md:flex flex-col items-center gap-2 text-white/60 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              aria-hidden
            >
              <span className="w-[22px] h-[34px] rounded-full border-[1.5px] border-white/50 flex justify-center pt-1.5">
                <motion.span
                  className="w-1 h-1.5 rounded-full bg-white"
                  animate={{ y: [0, 9, 0], opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
              Scroll
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
