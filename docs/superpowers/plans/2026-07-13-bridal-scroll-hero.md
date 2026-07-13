# Bridal Scroll-Hero Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/bridal` editorial page whose hero pins on scroll and scrubs through a 20-frame image sequence via GSAP ScrollTrigger + canvas, plus a homepage promo section linking to it.

**Architecture:** Client components under `src/components/bridal/` compose into a new `src/app/bridal/page.tsx` route (a Server Component that just composes them). The hero draws preloaded `HTMLImageElement`s to a `<canvas>`, indexed by GSAP `ScrollTrigger` scroll progress, using the same `sticky` + `ScrollTrigger` (no built-in `pin` option) pattern already used in `src/components/home/hero.tsx`. A new `BridalPromo` homepage section links to the page.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript, Tailwind CSS 4, GSAP 3.15 + `@gsap/react` + `ScrollTrigger` (already installed, globally ticked via `src/components/providers/smooth-scroll.tsx`'s Lenis loop), Framer Motion 12. No new dependencies.

## Global Constraints

- No new npm dependencies — `gsap`, `@gsap/react`, `framer-motion`, `lenis` are already installed and wired.
- Reuse existing design tokens only: `luxe-gold` (`#C9A96E`), `luxe-ink` (`#0D0D0D`), `font-serif`/`font-mono` pairing, `.eyebrow` class, `BlurFade` (`src/components/magicui/blur-fade.tsx`), `ShimmerButton` (`src/components/magicui/shimmer-button.tsx`).
- Frame assets: `public/images/animation1/frame_001.png` … `frame_020.png`, 3-digit zero-padded, 1280×720 each. No reprocessing/compression of these files.
- The hero section must use `id="hero"` so `src/components/layout/navbar.tsx`'s existing `IntersectionObserver` (keyed off `document.getElementById("hero")`, re-run per pathname) makes the navbar transparent-over-hero automatically.
- `prefers-reduced-motion: reduce` must fully skip preloading and `ScrollTrigger` — render a static first-frame hero instead.
- No test runner exists in this repo (no `*.test.*`/`*.spec.*` files, no test config in `package.json`) — verification is `npx tsc --noEmit`, `npm run lint`, `npm run build`, plus manual dev-server checks, not automated tests.

---

### Task 1: `BridalHero` canvas scroll-scrub component

**Files:**
- Create: `src/components/bridal/bridal-hero.tsx`

**Interfaces:**
- Produces: `export function BridalHero()` — a client component with no props, rendering `<section id="hero">`. Consumed by Task 3 (`src/app/bridal/page.tsx`).

- [ ] **Step 1: Write the component**

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 20
const frameSrc = (i: number) => `/images/animation1/frame_${String(i).padStart(3, "0")}.png`

export function BridalHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const frameIndexRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Preload all frames before enabling the scrub; skip entirely for reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true)
      return
    }

    let cancelled = false
    let loaded = 0
    const images: HTMLImageElement[] = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      const onSettle = () => {
        loaded += 1
        if (cancelled) return
        setProgress(loaded / FRAME_COUNT)
        if (loaded === FRAME_COUNT) {
          framesRef.current = images
          setReady(true)
        }
      }
      img.onload = onSettle
      img.onerror = onSettle
      images.push(img)
    }

    return () => { cancelled = true }
  }, [])

  // Pin (via CSS sticky, matching home hero.tsx) + scrub frames off scroll progress.
  useEffect(() => {
    if (!ready) return
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (index: number) => {
      const img = framesRef.current[index]
      if (!img || !img.complete || img.naturalWidth === 0) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const scale = Math.max(w / img.width, h / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
    }

    resizeCanvas()
    draw(0)

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const index = Math.round(self.progress * (FRAME_COUNT - 1))
        if (index !== frameIndexRef.current) {
          frameIndexRef.current = index
          draw(index)
        }
      },
      onRefresh: (self) => {
        resizeCanvas()
        const index = Math.round(self.progress * (FRAME_COUNT - 1))
        frameIndexRef.current = index
        draw(index)
      },
    })

    return () => trigger.kill()
  }, [ready])

  if (reducedMotion) {
    return (
      <section id="hero" className="relative h-screen w-full overflow-hidden bg-[#17120d]">
        <img
          src={frameSrc(1)}
          alt="The Bridal Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <BridalHeroOverlay />
      </section>
    )
  }

  return (
    <section id="hero" ref={sectionRef} style={{ height: "400vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#17120d]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {!ready && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-[#17120d]">
            <span className="font-mono text-[10px] tracking-[.3em] uppercase text-white/70">
              Loading the Collection
            </span>
            <div className="w-[160px] h-px bg-white/20 overflow-hidden">
              <div
                className="h-full bg-luxe-gold origin-left"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>
        )}
        {ready && <BridalHeroOverlay />}
      </div>
    </section>
  )
}

function BridalHeroOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(13,11,8,.6) 0%, transparent 45%, rgba(13,11,8,.2) 100%)" }}
      />
      <motion.div
        className="absolute left-7 md:left-[6vw] z-30 font-mono text-[10.5px] tracking-[.2em] uppercase text-white/75"
        style={{ top: "calc(var(--nav-h) + 28px)" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        The Bridal Collection
      </motion.div>
      <motion.h1
        className="absolute left-7 md:left-[6vw] z-30 font-serif leading-[0.95] tracking-[-0.02em] text-white max-w-[14ch]"
        style={{ top: "calc(var(--nav-h) + 64px)", fontSize: "clamp(44px,7vw,118px)" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        Vows, <span className="italic text-luxe-gold">Reimagined</span>
      </motion.h1>
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-7 z-30 hidden md:flex flex-col items-center gap-2 text-white/65"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <span className="font-mono text-[9px] tracking-[.3em]">SCROLL TO EXPLORE</span>
        <span className="w-px h-7 bg-white/40" />
      </motion.div>
    </>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors referencing `bridal-hero.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/bridal/bridal-hero.tsx
git commit -m "feat: add bridal hero canvas scroll-scrub component"
```

---

### Task 2: `BridalStory` and `BridalCTA` components

**Files:**
- Create: `src/components/bridal/bridal-story.tsx`
- Create: `src/components/bridal/bridal-cta.tsx`

**Interfaces:**
- Consumes: `BlurFade` from `src/components/magicui/blur-fade.tsx` (props: `children`, `delay?: number`, matching usage in `src/components/home/category-grid.tsx:24-27`); `ShimmerButton` from `src/components/magicui/shimmer-button.tsx` (props: `background`, `shimmerColor`, `shimmerSize`, `className`, `children`, matching usage in `src/components/home/hero.tsx:184-191`).
- Produces: `export function BridalStory()`, `export function BridalCTA()` — both no-prop client components. Consumed by Task 3.

- [ ] **Step 1: Write `bridal-story.tsx`**

```tsx
"use client"

import { BlurFade } from "@/components/magicui/blur-fade"

export function BridalStory() {
  return (
    <section className="py-24 md:py-32 max-w-[760px] mx-auto px-6 md:px-10 text-center">
      <BlurFade delay={0}>
        <div className="eyebrow mb-5">The Bridal Collection</div>
      </BlurFade>
      <BlurFade delay={0.1}>
        <p className="font-serif text-[clamp(24px,3vw,36px)] leading-snug text-luxe-ink">
          Cut from silk and hand-finished lace, each piece is built for the day
          you&apos;ll remember longest — quietly luxurious, unmistakably yours.
        </p>
      </BlurFade>
    </section>
  )
}
```

- [ ] **Step 2: Write `bridal-cta.tsx`**

```tsx
"use client"

import Link from "next/link"
import { ShimmerButton } from "@/components/magicui/shimmer-button"

export function BridalCTA() {
  return (
    <section className="pb-24 md:pb-32 flex justify-center">
      <ShimmerButton
        background="#C9A96E"
        shimmerColor="rgba(255,255,255,0.95)"
        shimmerSize="2px"
        className="px-8 py-3.5 font-mono text-[11px] tracking-widest text-luxe-ink"
      >
        <Link href="/shop?category=Women">SHOP THE EDIT</Link>
      </ShimmerButton>
    </section>
  )
}
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors referencing `bridal-story.tsx` or `bridal-cta.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/bridal/bridal-story.tsx src/components/bridal/bridal-cta.tsx
git commit -m "feat: add bridal story and CTA sections"
```

---

### Task 3: `/bridal` page route

**Files:**
- Create: `src/app/bridal/page.tsx`

**Interfaces:**
- Consumes: `BridalHero` (Task 1), `BridalStory`, `BridalCTA` (Task 2), `Footer` from `src/components/layout/footer.tsx` (existing, no-prop, used as `<Footer />` in `src/app/page.tsx:31`).

- [ ] **Step 1: Write the page**

```tsx
import { BridalHero } from "@/components/bridal/bridal-hero"
import { BridalStory } from "@/components/bridal/bridal-story"
import { BridalCTA } from "@/components/bridal/bridal-cta"
import { Footer } from "@/components/layout/footer"

export default function BridalPage() {
  return (
    <>
      <BridalHero />
      <BridalStory />
      <BridalCTA />
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Type-check, lint, and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three succeed; the build output lists `/bridal` as a generated route.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `http://localhost:3000/bridal`.
Expected:
- A loading overlay ("Loading the Collection" + gold progress bar) briefly appears, then clears.
- Scrolling down pins the hero full-screen and visibly advances through the 20 frames as you scroll, then releases into `BridalStory` → `BridalCTA` → footer.
- The navbar is transparent over the hero and turns solid once scrolled past it (same behavior as the homepage hero).
- Clicking "SHOP THE EDIT" navigates to `/shop?category=Women`.
- In DevTools, emulate `prefers-reduced-motion: reduce`, reload `/bridal`: hero renders as a static image immediately, no loading overlay, no pin/scrub.

- [ ] **Step 4: Commit**

```bash
git add src/app/bridal/page.tsx
git commit -m "feat: add /bridal page route"
```

---

### Task 4: `BridalPromo` homepage section

**Files:**
- Create: `src/components/home/bridal-promo.tsx`
- Modify: `src/app/page.tsx:1-36`

**Interfaces:**
- Produces: `export function BridalPromo()` — no-prop client component rendering a `<section>` linking to `/bridal`.
- Consumes: none beyond existing shared components (`BlurFade`).

- [ ] **Step 1: Write `bridal-promo.tsx`**

```tsx
"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { BlurFade } from "@/components/magicui/blur-fade"

export function BridalPromo() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link
          href="/bridal"
          className="relative block h-[420px] md:h-[560px] overflow-hidden group"
        >
          <img
            src="/images/animation1/frame_010.png"
            alt="The Bridal Edit"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-[rgba(13,13,13,.6)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 text-center text-white">
            <BlurFade delay={0}>
              <div className="font-mono text-[11px] tracking-[.2em] uppercase text-white/75 mb-3">
                New Edit
              </div>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="font-serif text-[clamp(32px,4vw,52px)] mb-3">The Bridal Edit</div>
            </BlurFade>
            <BlurFade delay={0.15}>
              <div className="flex items-center gap-2 font-mono text-[11px] tracking-[.1em] uppercase">
                Discover the Collection <ArrowRight size={14} />
              </div>
            </BlurFade>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Wire into the homepage**

Modify `src/app/page.tsx`: add the import and render `<BridalPromo />` immediately after `<CategoryGrid />`.

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Hero } from "@/components/home/hero"
import { CategoryGrid } from "@/components/home/category-grid"
import { BridalPromo } from "@/components/home/bridal-promo"
import { NewArrivals } from "@/components/home/new-arrivals"
import { MarqueeBanner } from "@/components/home/marquee-banner"
import { Bestsellers } from "@/components/home/bestsellers"
import { Newsletter } from "@/components/home/newsletter"
import { Footer } from "@/components/layout/footer"
import { QuickView } from "@/components/product/quick-view"
import { SizeGuide } from "@/components/product/size-guide"
import { type Product } from "@/data/products"

export default function HomePage() {
  const router = useRouter()
  const [quickProduct, setQuickProduct] = useState<Product | null>(null)
  const [sizeOpen, setSizeOpen] = useState(false)

  const handleOpen = (p: Product) => router.push(`/product/${p.id}`)

  return (
    <>
      <Hero />
      <CategoryGrid />
      <BridalPromo />
      <NewArrivals onOpen={handleOpen} onQuick={setQuickProduct} />
      <MarqueeBanner />
      <Bestsellers onOpen={handleOpen} onQuick={setQuickProduct} />
      <Newsletter />
      <Footer />
      <QuickView product={quickProduct} open={!!quickProduct} onClose={() => setQuickProduct(null)} />
      <SizeGuide open={sizeOpen} onClose={() => setSizeOpen(false)} />
    </>
  )
}
```

- [ ] **Step 3: Type-check, lint, and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three succeed.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open `http://localhost:3000/`.
Expected:
- Scrolling past the category grid reveals "The Bridal Edit" promo banner, fading/sliding in.
- Clicking it (or its "Discover the Collection" text) navigates to `/bridal`.
- Hovering the banner image gently scales it (existing `group-hover:scale-[1.06]` pattern).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/bridal-promo.tsx src/app/page.tsx
git commit -m "feat: add bridal promo section to homepage"
```

---

## Post-plan verification

- [ ] Full `npx tsc --noEmit && npm run lint && npm run build` clean across the whole repo.
- [ ] `npm run dev` — walk the full path: `/` → click bridal promo → `/bridal` → scroll through hero scrub → story → CTA → `/shop?category=Women`.
- [ ] Reduced-motion emulation on both `/` (no behavior change expected there) and `/bridal` (static hero, no pin/scrub/preload).
