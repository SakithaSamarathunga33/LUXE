"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { Photo } from "@/components/shared/photo"
import { cn } from "@/lib/utils"

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

interface HeroProps {
  variant?: "dark" | "split" | "editorial"
}

export function Hero({ variant = "dark" }: HeroProps) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-hero]")
    if (!els.length) return
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    els.forEach((el, i) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(28px)"
      setTimeout(() => {
        el.style.transition = "opacity 0.9s ease, transform 0.9s ease"
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
      }, 180 + i * 120)
    })
  }, [variant])

  if (variant === "split") {
    return (
      <section className="grid min-h-screen" style={{ gridTemplateColumns: "1.05fr 1fr", paddingTop: 0, marginTop: "calc(-1 * var(--nav-h))" }}>
        <div className="relative bg-[#ece6dc]">
          <Photo src={U("1483985988355-763728e1935b", 1300)} eager className="absolute inset-0 w-full h-full" />
        </div>
        <div className="flex flex-col justify-center px-[8vw] py-[120px]">
          <div data-hero className="eyebrow mb-6">Spring / Summer 2026</div>
          <h1 data-hero className="font-serif text-[clamp(44px,5.2vw,84px)] leading-[1.05]">
            The Quiet <br />
            <AnimatedGradientText>Luxury</AnimatedGradientText> Edit
          </h1>
          <p data-hero className="text-luxe-muted text-[17px] mt-6 mb-9 max-w-[420px]">
            Considered tailoring and elevated essentials, made to be lived in.
          </p>
          <div data-hero className="flex gap-3.5 flex-wrap">
            <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.5)"
              className="px-8 py-3.5 font-mono text-xs tracking-widest text-luxe-ink">
              <Link href="/shop?filter=new">SHOP NEW ARRIVALS</Link>
            </ShimmerButton>
            <Link href="/shop?category=Women"
              className="px-8 py-3.5 border border-luxe-line font-mono text-xs tracking-widest hover:bg-luxe-paper transition-colors">
              EXPLORE WOMEN
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (variant === "editorial") {
    return (
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center relative px-6 py-[120px]"
        style={{ background: "linear-gradient(180deg,#F2EEE7,#F9F7F4)", marginTop: "calc(-1 * var(--nav-h))", paddingTop: "calc(120px + var(--nav-h))" }}
      >
        <div data-hero className="eyebrow mb-7">· New Collection ·</div>
        <h1 data-hero className="font-serif text-[clamp(52px,9vw,150px)] leading-none tracking-[-0.02em]">
          <AnimatedGradientText>LUXE</AnimatedGradientText>
        </h1>
        <div data-hero className="w-[480px] max-w-[80vw] h-[300px] mx-auto my-9 relative">
          <Photo src={U("1539109136881-3be0616acf4b", 1100)} eager
            className="absolute inset-0 w-full h-full rounded-[260px_260px_0_0] overflow-hidden" />
        </div>
        <p data-hero className="font-serif italic text-xl text-[#555]">Made for the modern wardrobe.</p>
        <div data-hero className="mt-8">
          <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.5)"
            className="px-8 py-3.5 font-mono text-xs tracking-widest text-luxe-ink">
            <Link href="/shop?filter=new">SHOP NEW ARRIVALS</Link>
          </ShimmerButton>
        </div>
      </section>
    )
  }

  // dark (default)
  return (
    <section
      className="relative flex items-end overflow-hidden bg-[#17120d]"
      style={{ height: "100vh", minHeight: 640, marginTop: "calc(-1 * var(--nav-h))" }}
    >
      <Photo src={U("1490481651871-ab68de25d43d")} eager dark className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,13,13,.28)] via-[rgba(13,13,13,.12)] to-[rgba(13,13,13,.72)]" />
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 w-full pb-[9vh] text-white">
        <div data-hero className="font-mono text-[10.5px] tracking-[.2em] uppercase text-white/78 mb-5">
          Spring / Summer 2026
        </div>
        <h1 data-hero className="font-serif text-[clamp(48px,8vw,128px)] text-white leading-[1.0] max-w-[14ch]">
          Dressed in{" "}
          <AnimatedGradientText className="font-serif italic text-[clamp(48px,8vw,128px)]">
            Confidence
          </AnimatedGradientText>
        </h1>
        <div data-hero className="w-28 h-[3px] bg-luxe-gold my-7" />
        <p data-hero className="max-w-[440px] text-white/85 text-[17px] mb-9">
          The new arrivals collection — refined silhouettes, honest fabrics, made to last beyond the season.
        </p>
        <div data-hero className="flex gap-3.5 flex-wrap">
          <ShimmerButton background="#C9A96E" shimmerColor="rgba(255,255,255,0.5)"
            className="px-8 py-3.5 font-mono text-xs tracking-widest text-luxe-ink">
            <Link href="/shop?filter=new">SHOP NEW ARRIVALS</Link>
          </ShimmerButton>
          <Link href="/shop?category=Women"
            className="px-8 py-3.5 bg-white/12 backdrop-blur-sm border border-white/30 font-mono text-xs tracking-widest text-white hover:bg-white/20 transition-colors">
            EXPLORE COLLECTION
          </Link>
        </div>
      </div>
      <div className="absolute bottom-7 right-10 text-white/60 flex-col items-center gap-2 hidden md:flex">
        <span className="font-mono text-[10px] tracking-[.3em] [writing-mode:vertical-rl]">SCROLL</span>
        <span className="w-px h-[46px] bg-white/40" />
      </div>
    </section>
  )
}
