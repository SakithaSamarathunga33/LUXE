# Remotion Brand Film Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Remotion to the LUXE storefront and ship an ambient, auto-looping ~20s "SS26 brand film" as a full-bleed homepage section rendered live by `@remotion/player`.

**Architecture:** A pure Remotion composition lives in `src/remotion/brand-film/` (4 scenes + shared motion constants); the site touches it only through `src/components/home/brand-film-section.tsx`, which lazy-loads a thin player wrapper via `next/dynamic` when the section nears the viewport. A static poster holds the space until then (and forever, under reduced motion or chunk failure).

**Tech Stack:** Next.js 16.2.6 (App Router, Turbopack), React 19.2.4, TypeScript, Tailwind v4 tokens, `remotion` + `@remotion/player` 4.0.485.

**Spec:** `docs/superpowers/specs/2026-07-06-remotion-brand-film-design.md`

## Global Constraints

- `remotion` and `@remotion/player` MUST be pinned to the **exact same version**: `4.0.485` (install with `-E`).
- The composition (`src/remotion/**`) may import ONLY from `remotion`, `react`, and `@/data/products` — never site components.
- The site imports the composition ONLY through `src/components/home/brand-film-section.tsx` (which goes through `brand-film-player.tsx`).
- Composition format: 1920×1080, 30fps, 600 frames (~20s), invisible loop (frame 599 visually ≡ frame 0: flat `#0D0D0D`).
- Colors/typography: `#C9A96E` (gold), `#B2904E` (deep gold), `#0D0D0D` (ink), `#F9F7F4` (bone); `'Cormorant Garamond', Georgia, serif` and `'JetBrains Mono', monospace` (already loaded globally via `globals.css`).
- House easing: cubic-bezier(0.22, 1, 0.36, 1) — same curve the site uses.
- `prefers-reduced-motion: reduce` → the player must never mount.
- **This repo has no unit-test framework** (none exists; do not add one). Per the spec, verification = `npx tsc --noEmit` after every task + a Playwright drive at the end. Run all commands from the repo root `d:\Projects\FashionClothing store`.

---

### Task 1: Install Remotion dependencies

**Files:**
- Modify: `package.json` (via npm)

**Interfaces:**
- Produces: importable `remotion` (AbsoluteFill, Sequence, Img, interpolate, Easing, useCurrentFrame) and `@remotion/player` (Player, PlayerRef) for all later tasks.

- [ ] **Step 1: Install both packages, exact-pinned to the same version**

Run: `npm install -E remotion@4.0.485 @remotion/player@4.0.485`

- [ ] **Step 2: Verify versions match exactly**

Run: `node -e "const p=require('./package.json'); console.log(p.dependencies.remotion, p.dependencies['@remotion/player'])"`
Expected: `4.0.485 4.0.485` (no `^` or `~` prefixes).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add remotion and @remotion/player (pinned 4.0.485)"
```

---

### Task 2: Motion language + film grain

**Files:**
- Create: `src/remotion/brand-film/motion.ts`
- Create: `src/remotion/brand-film/grain.tsx`

**Interfaces:**
- Produces (motion.ts): `FPS: 30`, `WIDTH: 1920`, `HEIGHT: 1080`, `TOTAL: 600`, scene windows `TITLE/MONTAGE/TICKER/OUTRO: { from: number; duration: number }`, colors `GOLD/GOLD_DEEP/INK/BONE: string`, fonts `SERIF/MONO: string`, `luxeEase: (t: number) => number`.
- Produces (grain.tsx): `Grain: React.FC` — a pointer-events-none noise overlay.

- [ ] **Step 1: Write `src/remotion/brand-film/motion.ts`**

```ts
import { Easing } from "remotion"

/* ── Format ─────────────────────────────────────────────── */
export const FPS = 30
export const WIDTH = 1920
export const HEIGHT = 1080
export const TOTAL = 600 // ~20s seamless loop

/* ── Scene windows (frames) ─────────────────────────────── */
export const TITLE = { from: 0, duration: 120 }    // 4s — kinetic title card
export const MONTAGE = { from: 120, duration: 240 } // 8s — three-look montage
export const TICKER = { from: 360, duration: 150 }  // 5s — product typographic cards
export const OUTRO = { from: 510, duration: 90 }    // 3s — resolve to frame 0's flat ink

/* ── LUXE tokens (mirrors globals.css) ──────────────────── */
export const GOLD = "#C9A96E"
export const GOLD_DEEP = "#B2904E"
export const INK = "#0D0D0D"
export const BONE = "#F9F7F4"

export const SERIF = "'Cormorant Garamond', Georgia, serif"
export const MONO = "'JetBrains Mono', monospace"

/* ── House easing — the site's [0.22, 1, 0.36, 1] curve ── */
export const luxeEase = Easing.bezier(0.22, 1, 0.36, 1)
```

- [ ] **Step 2: Write `src/remotion/brand-film/grain.tsx`**

```tsx
import { AbsoluteFill, useCurrentFrame } from "remotion"

const NOISE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)' opacity='0.6'/></svg>"

export const Grain: React.FC = () => {
  const frame = useCurrentFrame()
  const jitter = (frame * 7) % 3 // cheap per-frame shimmer
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${NOISE}")`,
        opacity: 0.06,
        transform: `translate(${jitter * 2}px, ${-jitter * 3}px)`,
        pointerEvents: "none",
      }}
    />
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/remotion/brand-film/motion.ts src/remotion/brand-film/grain.tsx
git commit -m "feat: add brand-film motion language and film grain overlay"
```

---

### Task 3: Title card scene

**Files:**
- Create: `src/remotion/brand-film/scenes/title-card.tsx`

**Interfaces:**
- Consumes: `GOLD, INK, BONE, SERIF, MONO, luxeEase` from `../motion`; `Grain` from `../grain`.
- Produces: `TitleCard: React.FC` — 120-frame scene; frame 0 is flat `INK` (the loop seam), fully faded out by frame 120.

- [ ] **Step 1: Write `src/remotion/brand-film/scenes/title-card.tsx`**

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { GOLD, INK, BONE, SERIF, MONO, luxeEase } from "../motion"
import { Grain } from "../grain"

const WORD = "LUXE"
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame()

  // Gold radial glow breathes in behind the type
  const glow = interpolate(frame, [0, 60], [0, 0.45], { ...clamp, easing: luxeEase })

  // Whole card fades out into the montage
  const fadeOut = interpolate(frame, [96, 120], [1, 0], clamp)

  // Sub-line + eyebrow follow the wordmark
  const sub = interpolate(frame, [44, 74], [0, 1], { ...clamp, easing: luxeEase })
  const subY = interpolate(frame, [44, 74], [42, 0], { ...clamp, easing: luxeEase })
  const eyebrow = interpolate(frame, [60, 88], [0, 1], { ...clamp, easing: luxeEase })

  return (
    <AbsoluteFill
      style={{
        backgroundColor: INK,
        opacity: fadeOut,
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at 50% 45%, rgba(201,169,110,${glow}) 0%, transparent 70%)`,
        }}
      />
      <div style={{ display: "flex", position: "relative" }}>
        {WORD.split("").map((ch, i) => {
          const start = 8 + i * 6
          const o = interpolate(frame, [start, start + 24], [0, 1], { ...clamp, easing: luxeEase })
          const y = interpolate(frame, [start, start + 24], [64, 0], { ...clamp, easing: luxeEase })
          const ls = interpolate(frame, [start, start + 44], [0.6, 0.24], { ...clamp, easing: luxeEase })
          return (
            <span
              key={i}
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 230,
                lineHeight: 1,
                color: BONE,
                opacity: o,
                transform: `translateY(${y}px)`,
                letterSpacing: `${ls}em`,
              }}
            >
              {ch}
            </span>
          )
        })}
      </div>
      <div
        style={{
          position: "relative",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 66,
          color: GOLD,
          opacity: sub,
          transform: `translateY(${subY}px)`,
        }}
      >
        The Art of Movement
      </div>
      <div
        style={{
          position: "relative",
          fontFamily: MONO,
          fontSize: 21,
          letterSpacing: "0.34em",
          color: "rgba(249,247,244,0.6)",
          opacity: eyebrow,
        }}
      >
        SPRING / SUMMER 2026
      </div>
      <Grain />
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/remotion/brand-film/scenes/title-card.tsx
git commit -m "feat: add brand-film title card scene"
```

---

### Task 4: Look montage scene

**Files:**
- Create: `src/remotion/brand-film/scenes/look-montage.tsx`

**Interfaces:**
- Consumes: `GOLD, INK, BONE, SERIF, MONO, luxeEase` from `../motion`; `Grain` from `../grain`; images in `/public/images/`.
- Produces: `LookMontage: React.FC` — 240-frame scene, three 80-frame hard-cut shots.

- [ ] **Step 1: Write `src/remotion/brand-film/scenes/look-montage.tsx`**

```tsx
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame } from "remotion"
import { GOLD, INK, SERIF, MONO, luxeEase } from "../motion"
import { Grain } from "../grain"

type Look = { src: string; no: string; name: string; pos: string }

const LOOKS: Look[] = [
  { src: "/images/hero-main.png", no: "01", name: "Ember Silk", pos: "78% 50%" },
  { src: "/images/hero-aside.png", no: "02", name: "Desert Trench", pos: "60% 50%" },
  { src: "/images/look-01.png", no: "03", name: "Tailored Noir", pos: "72% 50%" },
]

const PER = 80 // frames per shot
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const

const LookShot: React.FC<{ look: Look }> = ({ look }) => {
  const frame = useCurrentFrame() // local to the parent <Sequence>

  // Slow Ken Burns settle across the whole shot
  const scale = interpolate(frame, [0, PER], [1.1, 1], { easing: luxeEase })

  // Oversized number + caption wipe in from the left
  const wipe = interpolate(frame, [6, 32], [100, 0], { ...clamp, easing: luxeEase })

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <Img
        src={look.src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: look.pos,
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(0deg, rgba(13,13,13,0.58) 0%, transparent 45%)" }}
      />
      <div style={{ position: "absolute", left: 96, bottom: 72, clipPath: `inset(0 ${wipe}% 0 0)` }}>
        <div style={{ fontFamily: SERIF, fontSize: 270, lineHeight: 0.9, color: "rgba(249,247,244,0.92)" }}>
          {look.no}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 23, letterSpacing: "0.3em", color: GOLD, marginTop: 18 }}>
          {look.name.toUpperCase()}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 96,
          bottom: 84,
          fontFamily: MONO,
          fontSize: 19,
          letterSpacing: "0.3em",
          color: "rgba(249,247,244,0.55)",
        }}
      >
        THE LOOKBOOK
      </div>
      <Grain />
    </AbsoluteFill>
  )
}

export const LookMontage: React.FC = () => (
  <AbsoluteFill>
    {LOOKS.map((look, i) => (
      <Sequence key={look.no} from={i * PER} durationInFrames={PER}>
        <LookShot look={look} />
      </Sequence>
    ))}
  </AbsoluteFill>
)
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/remotion/brand-film/scenes/look-montage.tsx
git commit -m "feat: add brand-film look montage scene"
```

---

### Task 5: Product ticker scene

**Files:**
- Create: `src/remotion/brand-film/scenes/product-ticker.tsx`

**Interfaces:**
- Consumes: `GOLD, INK, BONE, SERIF, MONO, luxeEase` from `../motion`; `Grain` from `../grain`; `PRODUCTS` from `@/data/products`.
- Produces: `ProductTicker: React.FC` — 150-frame scene, four staggered typographic product cards over a blurred backdrop.

- [ ] **Step 1: Write `src/remotion/brand-film/scenes/product-ticker.tsx`**

```tsx
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame } from "remotion"
import { PRODUCTS } from "@/data/products"
import { GOLD, INK, BONE, SERIF, MONO, luxeEase } from "../motion"
import { Grain } from "../grain"

const ITEMS = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4)
const PER = 37 // frames per card (4 × 37 ≈ 150)
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const

const Card: React.FC<{ item: (typeof ITEMS)[number]; index: number }> = ({ item, index }) => {
  const frame = useCurrentFrame() // local to the parent <Sequence>
  const o = interpolate(frame, [0, 12, PER - 8, PER], [0, 1, 1, 0], { ...clamp, easing: luxeEase })
  const y = interpolate(frame, [0, 14], [70, 0], { ...clamp, easing: luxeEase })

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: o, transform: `translateY(${y}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.34em", color: GOLD, marginBottom: 26 }}>
          {String(index + 1).padStart(2, "0")} — {item.category.toUpperCase()} / {item.type.toUpperCase()}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 118, lineHeight: 1, color: BONE, maxWidth: 1400 }}>
          {item.name}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 27, letterSpacing: "0.2em", color: "rgba(249,247,244,0.72)", marginTop: 30 }}>
          ${item.salePrice ?? item.price}
        </div>
      </div>
    </AbsoluteFill>
  )
}

export const ProductTicker: React.FC = () => {
  const frame = useCurrentFrame()
  const fadeIn = interpolate(frame, [0, 18], [0, 1], clamp)

  return (
    <AbsoluteFill style={{ backgroundColor: INK, opacity: fadeIn }}>
      <Img
        src="/images/hero-aside.png"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(28px) brightness(0.45)",
          transform: "scale(1.12)", // hide blur edge bleed
        }}
      />
      {ITEMS.map((item, i) => (
        <Sequence key={item.id} from={i * PER} durationInFrames={PER}>
          <Card item={item} index={i} />
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/remotion/brand-film/scenes/product-ticker.tsx
git commit -m "feat: add brand-film product ticker scene"
```

---

### Task 6: Outro scene + root composition

**Files:**
- Create: `src/remotion/brand-film/scenes/outro.tsx`
- Create: `src/remotion/brand-film/composition.tsx`

**Interfaces:**
- Consumes: all four scenes; `TITLE, MONTAGE, TICKER, OUTRO, INK` etc. from `../motion` / `./motion`.
- Produces: `Outro: React.FC` (90 frames, resolves to flat `INK` by its end — the loop seam) and `BrandFilm: React.FC` — the root composition Task 7's Player renders.

- [ ] **Step 1: Write `src/remotion/brand-film/scenes/outro.tsx`**

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { GOLD, INK, BONE, SERIF, MONO, luxeEase } from "../motion"
import { Grain } from "../grain"

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const

export const Outro: React.FC = () => {
  const frame = useCurrentFrame()

  const textIn = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: luxeEase })
  const textY = interpolate(frame, [0, 26], [36, 0], { ...clamp, easing: luxeEase })
  const line = interpolate(frame, [10, 44], [0, 1], { ...clamp, easing: luxeEase })

  // Everything gone by frame 88 → frames 588-599 are flat ink, matching frame 0
  const fadeOut = interpolate(frame, [58, 88], [1, 0], clamp)

  return (
    <AbsoluteFill style={{ backgroundColor: INK, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: textIn * fadeOut, transform: `translateY(${textY}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 96, color: BONE }}>
          Spring / Summer 2026
        </div>
        <div
          style={{
            width: `${line * 340}px`,
            height: 1,
            backgroundColor: GOLD,
            margin: "34px auto 30px",
          }}
        />
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.34em", color: "rgba(249,247,244,0.6)" }}>
          LUXE — THE CAMPAIGN
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  )
}
```

- [ ] **Step 2: Write `src/remotion/brand-film/composition.tsx`**

```tsx
import { AbsoluteFill, Sequence } from "remotion"
import { TITLE, MONTAGE, TICKER, OUTRO, INK } from "./motion"
import { TitleCard } from "./scenes/title-card"
import { LookMontage } from "./scenes/look-montage"
import { ProductTicker } from "./scenes/product-ticker"
import { Outro } from "./scenes/outro"

export const BrandFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <Sequence from={TITLE.from} durationInFrames={TITLE.duration}>
      <TitleCard />
    </Sequence>
    <Sequence from={MONTAGE.from} durationInFrames={MONTAGE.duration}>
      <LookMontage />
    </Sequence>
    <Sequence from={TICKER.from} durationInFrames={TICKER.duration}>
      <ProductTicker />
    </Sequence>
    <Sequence from={OUTRO.from} durationInFrames={OUTRO.duration}>
      <Outro />
    </Sequence>
  </AbsoluteFill>
)
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/remotion/brand-film/scenes/outro.tsx src/remotion/brand-film/composition.tsx
git commit -m "feat: add brand-film outro and root composition"
```

---

### Task 7: Player wrapper, homepage section, page wiring

**Files:**
- Create: `src/components/home/brand-film-player.tsx`
- Create: `src/components/home/brand-film-section.tsx`
- Modify: `src/app/page.tsx` (insert section between `<MarqueeBanner />` and `<Bestsellers …>`)

**Interfaces:**
- Consumes: `BrandFilm` from `@/remotion/brand-film/composition`; `FPS, TOTAL, WIDTH, HEIGHT` from `@/remotion/brand-film/motion`; `Player, PlayerRef` from `@remotion/player`; `BlurFade` from `@/components/magicui/blur-fade`.
- Produces: `BrandFilmSection: React.FC` (named export) used by `page.tsx`; `BrandFilmPlayer` (default export, props `{ playing: boolean }`) loaded only via `next/dynamic`. Section root carries `data-testid="brand-film"` (Task 8 depends on it).

- [ ] **Step 1: Write `src/components/home/brand-film-player.tsx`**

Default export (simplest `next/dynamic` target). The Player is muted and loops; play/pause is driven by the `playing` prop, not `autoPlay`, so playback state always follows section visibility.

```tsx
"use client"

import { useEffect, useRef } from "react"
import { Player, type PlayerRef } from "@remotion/player"
import { BrandFilm } from "@/remotion/brand-film/composition"
import { FPS, TOTAL, WIDTH, HEIGHT } from "@/remotion/brand-film/motion"

export default function BrandFilmPlayer({ playing }: { playing: boolean }) {
  const ref = useRef<PlayerRef>(null)

  useEffect(() => {
    if (playing) ref.current?.play()
    else ref.current?.pause()
  }, [playing])

  return (
    <Player
      ref={ref}
      component={BrandFilm}
      durationInFrames={TOTAL}
      compositionWidth={WIDTH}
      compositionHeight={HEIGHT}
      fps={FPS}
      loop
      muted
      style={{ width: "100%", height: "100%" }}
    />
  )
}
```

- [ ] **Step 2: Write `src/components/home/brand-film-section.tsx`**

Poster sits underneath; the player covers it once mounted. If the chunk never loads, the poster remains (spec: no error UI). Reduced motion → observers never attach, player never mounts.

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { BlurFade } from "@/components/magicui/blur-fade"

const BrandFilmPlayer = dynamic(() => import("./brand-film-player"), { ssr: false })

export function BrandFilmSection() {
  const frameRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false) // player chunk requested
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Mount the player one viewport early so it's ready when it scrolls in
    const mountObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          mountObs.disconnect()
        }
      },
      { rootMargin: "100% 0px" },
    )
    mountObs.observe(el)

    // Play only while a meaningful part of the film is on screen
    const playObs = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.25 },
    )
    playObs.observe(el)

    return () => {
      mountObs.disconnect()
      playObs.disconnect()
    }
  }, [])

  return (
    <section className="py-20 bg-luxe-ink" data-testid="brand-film">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 mb-10">
        <BlurFade delay={0} inView>
          <div className="font-mono text-[11px] tracking-[.2em] uppercase text-luxe-gold mb-3.5">
            The Campaign
          </div>
        </BlurFade>
        <BlurFade delay={0.1} inView>
          <h2 className="font-serif text-[clamp(32px,4vw,52px)] text-white">SS26 — The Film</h2>
        </BlurFade>
      </div>
      <div ref={frameRef} className="relative w-full aspect-video overflow-hidden">
        {/* Poster — holds the space until (or in place of) the player */}
        <img
          src="/images/hero-main.png"
          alt="LUXE SS26 campaign film"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "78% 50%" }}
          loading="lazy"
          draggable={false}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgba(13,13,13,.55) 0%, transparent 40%)" }}
        />
        {mounted && (
          <div className="absolute inset-0">
            <BrandFilmPlayer playing={playing} />
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Wire into `src/app/page.tsx`**

Add the import after the `MarqueeBanner` import:

```tsx
import { MarqueeBanner } from "@/components/home/marquee-banner"
import { BrandFilmSection } from "@/components/home/brand-film-section"
```

Insert the section between `<MarqueeBanner />` and `<Bestsellers …>`:

```tsx
      <MarqueeBanner />
      <BrandFilmSection />
      <Bestsellers onOpen={handleOpen} onQuick={setQuickProduct} />
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/brand-film-player.tsx src/components/home/brand-film-section.tsx src/app/page.tsx
git commit -m "feat: add lazy-loaded brand film section to homepage"
```

---

### Task 8: Browser verification (Playwright drive)

**Files:**
- Create (scratch, NOT committed): `<scratchpad>/verify-brand-film.mjs` — use the session scratchpad directory; do not add this to the repo.

**Interfaces:**
- Consumes: `data-testid="brand-film"` from Task 7; the Remotion Player renders a `.__remotion-player` element. Dev server: `npm run dev` (a server may already be running on port 3000 — reuse it; if none, start one in the background).

- [ ] **Step 1: Ensure the dev server is up**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
Expected: `200`. If not, start `npm run dev` in the background and wait for "Ready".

- [ ] **Step 2: Write the verification script**

```js
import { chromium } from "playwright"

const browser = await chromium.launch()

/* ── Normal motion: player mounts, animates, pauses off-screen ── */
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message))
await page.goto("http://localhost:3000", { waitUntil: "networkidle" })

await page.locator('[data-testid="brand-film"]').scrollIntoViewIfNeeded()
await page.waitForSelector(".__remotion-player", { timeout: 15000 })
console.log("PASS: player mounted")

await page.waitForTimeout(500)
const frame = page.locator('[data-testid="brand-film"]')
const shot1 = await frame.screenshot()
await page.waitForTimeout(1500)
const shot2 = await frame.screenshot()
console.log(shot1.equals(shot2) ? "FAIL: film is not animating" : "PASS: film is animating")

await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)
const shot3 = await frame.screenshot()
await page.waitForTimeout(1200)
const shot4 = await frame.screenshot()
console.log(shot3.equals(shot4) ? "PASS: film paused off-screen" : "FAIL: film still playing off-screen")

await frame.scrollIntoViewIfNeeded()
await page.waitForTimeout(1000)
await page.screenshot({ path: "brand-film-section.png" })

/* ── Reduced motion: player must never mount ── */
const rmPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })
await rmPage.goto("http://localhost:3000", { waitUntil: "networkidle" })
await rmPage.locator('[data-testid="brand-film"]').scrollIntoViewIfNeeded()
await rmPage.waitForTimeout(2500)
const mounted = await rmPage.locator(".__remotion-player").count()
console.log(mounted === 0 ? "PASS: reduced motion keeps poster only" : "FAIL: player mounted under reduced motion")

await browser.close()
```

Note: `newPage({ reducedMotion: "reduce" })` — if the installed Playwright rejects this option on `newPage`, use `browser.newContext({ reducedMotion: "reduce" })` then `context.newPage()`.

- [ ] **Step 3: Run it**

The script needs the `playwright` package resolvable (its Chromium binary is already installed at `~/AppData/Local/ms-playwright`; if missing, run `npx playwright install chromium` once). Do NOT add playwright to the repo's package.json — install it in the scratchpad instead:

```bash
cd <scratchpad>
npm init -y
npm install playwright@1.61.1
node verify-brand-film.mjs
```

Expected output — all four lines PASS:

```
PASS: player mounted
PASS: film is animating
PASS: film paused off-screen
PASS: reduced motion keeps poster only
```

- [ ] **Step 4: Look at the screenshot**

Open `brand-film-section.png` and confirm: the section shows dark ink background, gold "The Campaign" eyebrow, white serif "SS26 — The Film" heading, and a film frame that is NOT the poster (i.e., typography/scene content visible).

- [ ] **Step 5: Fix anything that failed, re-run until green, then finish**

If all four checks pass and the screenshot looks right, the plan is complete. No commit in this task (script is scratch-only); the working tree should be clean.
