"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { Photo } from "@/components/shared/photo"

gsap.registerPlugin(ScrollTrigger)

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

interface HeroProps {
  variant?: "dark" | "split" | "editorial"
}

export function Hero({ variant = "dark" }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(() => {
    if (reduced || !imgRef.current || !sectionRef.current) return
    gsap.to(imgRef.current, {
      yPercent: 28,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })
  }, { scope: sectionRef, dependencies: [variant, reduced] })

  const ent = (i: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduced ? 0 : 0.2 + i * 0.13, duration: 0.9, ease: "easeOut" },
  })

  /* ── SPLIT ─────────────────────────────────────────────── */
  if (variant === "split") {
    return (
      <section
        ref={sectionRef}
        className="grid min-h-screen"
        style={{ gridTemplateColumns: "1.05fr 1fr", paddingTop: 0, marginTop: "calc(-1 * var(--nav-h))" }}
      >
        <div className="relative bg-[#ece6dc] overflow-hidden">
          <div ref={imgRef} className="absolute inset-x-0 -top-[15%] bottom-0 will-change-transform">
            <Photo src={U("1483985988355-763728e1935b", 1300)} eager className="absolute inset-0 w-full h-full" />
          </div>
        </div>
        <div className="flex flex-col justify-center px-[8vw] py-[120px]">
          <motion.div {...ent(0)} className="eyebrow mb-6">Spring / Summer 2026</motion.div>
          <motion.h1 {...ent(1)} className="font-serif text-[clamp(44px,5.2vw,84px)] leading-[1.05]">
            The Quiet <br />
            <AnimatedGradientText>Luxury</AnimatedGradientText> Edit
          </motion.h1>
          <motion.p {...ent(2)} className="text-luxe-muted text-[17px] mt-6 mb-9 max-w-[420px]">
            Considered tailoring and elevated essentials, made to be lived in.
          </motion.p>
          <motion.div {...ent(3)} className="flex gap-3.5 flex-wrap">
            <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.95)" shimmerSize="2px"
              className="px-8 py-3.5 font-mono text-xs tracking-widest text-luxe-ink">
              <Link href="/shop?filter=new">SHOP NEW ARRIVALS</Link>
            </ShimmerButton>
            <Link href="/shop?category=Women"
              className="px-8 py-3.5 border border-luxe-line font-mono text-xs tracking-widest hover:bg-luxe-paper transition-colors">
              EXPLORE WOMEN
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  /* ── EDITORIAL ──────────────────────────────────────────── */
  if (variant === "editorial") {
    return (
      <section
        ref={sectionRef}
        className="min-h-screen flex flex-col items-center justify-center text-center relative px-6 py-[120px]"
        style={{ background: "linear-gradient(180deg,#F2EEE7,#F9F7F4)", marginTop: "calc(-1 * var(--nav-h))", paddingTop: "calc(120px + var(--nav-h))" }}
      >
        <motion.div {...ent(0)} className="eyebrow mb-7">· New Collection ·</motion.div>
        <motion.h1 {...ent(1)} className="font-serif text-[clamp(52px,9vw,150px)] leading-none tracking-[-0.02em]">
          <AnimatedGradientText>LUXE</AnimatedGradientText>
        </motion.h1>
        <motion.div {...ent(2)} className="w-[480px] max-w-[80vw] h-[300px] mx-auto my-9 relative">
          <Photo src={U("1539109136881-3be0616acf4b", 1100)} eager
            className="absolute inset-0 w-full h-full rounded-[260px_260px_0_0] overflow-hidden" />
        </motion.div>
        <motion.p {...ent(3)} className="font-serif italic text-xl text-[#555]">Made for the modern wardrobe.</motion.p>
        <motion.div {...ent(4)} className="mt-8">
          <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.95)" shimmerSize="2px"
            className="px-8 py-3.5 font-mono text-xs tracking-widest text-luxe-ink">
            <Link href="/shop?filter=new">SHOP NEW ARRIVALS</Link>
          </ShimmerButton>
        </motion.div>
      </section>
    )
  }

  /* ── DARK (default) ─────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative flex items-end overflow-hidden bg-[#17120d]"
      style={{ height: "100vh", minHeight: 640, marginTop: "calc(-1 * var(--nav-h))" }}
    >
      {/* Parallax layer — extra height so parallax movement doesn't show edges */}
      <div ref={imgRef} className="absolute inset-x-0 -top-[15%] bottom-0 will-change-transform">
        <Photo src={U("1490481651871-ab68de25d43d")} eager dark className="absolute inset-0 w-full h-full" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,13,13,.28)] via-[rgba(13,13,13,.12)] to-[rgba(13,13,13,.72)]" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 w-full pb-[9vh] text-white">
        <motion.div {...ent(0)} className="font-mono text-[10.5px] tracking-[.2em] uppercase text-white/78 mb-5">
          Spring / Summer 2026
        </motion.div>

        <motion.h1 {...ent(1)} className="font-serif text-[clamp(48px,8vw,128px)] text-white leading-[1.0] max-w-[14ch]">
          Dressed in{" "}
          <AnimatedGradientText className="font-serif italic text-[clamp(48px,8vw,128px)]">
            Confidence
          </AnimatedGradientText>
        </motion.h1>

        {/* Gold line — draws left to right after headline appears */}
        <motion.div
          className="w-28 h-[3px] bg-luxe-gold my-7"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 0.65, delay: reduced ? 0 : 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        />

        <motion.p {...ent(3)} className="max-w-[440px] text-white/85 text-[17px] mb-9">
          The new arrivals collection — refined silhouettes, honest fabrics, made to last beyond the season.
        </motion.p>

        <motion.div {...ent(4)} className="flex gap-3.5 flex-wrap">
          <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.95)" shimmerSize="2px"
            className="px-8 py-3.5 font-mono text-xs tracking-widest text-luxe-ink">
            <Link href="/shop?filter=new">SHOP NEW ARRIVALS</Link>
          </ShimmerButton>
          <Link href="/shop?category=Women"
            className="px-8 py-3.5 bg-white/12 backdrop-blur-sm border border-white/30 font-mono text-xs tracking-widest text-white hover:bg-white/20 transition-colors">
            EXPLORE COLLECTION
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-7 right-10 text-white/60 flex-col items-center gap-2 hidden md:flex">
        <span className="font-mono text-[10px] tracking-[.3em] [writing-mode:vertical-rl]">SCROLL</span>
        <span className="w-px h-[46px] bg-white/40" />
      </div>
    </section>
  )
}
