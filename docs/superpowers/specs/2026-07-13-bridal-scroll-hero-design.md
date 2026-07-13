# Bridal Scroll-Hero Page — Design Spec

**Date:** 2026-07-13
**Status:** Approved

## Goal

Add a new `/bridal` editorial landing page whose hero pins on scroll and scrubs through a 20-frame image sequence (`public/images/animation1/frame_001.png`…`frame_020.png`), using GSAP ScrollTrigger + the site's existing Lenis smooth-scroll. Link to it from the homepage via a new promo section.

## Decisions (locked)

- **Animation type:** scroll-scrubbed frame sequence on `<canvas>` (Apple-style pinned hero), not a parallax stack.
- **Page scope:** hero + supporting editorial content (story copy + CTA), not hero-only.
- **Homepage entry point:** new dedicated promo section (`BridalPromo`) placed after `CategoryGrid`, not folded into the existing category grid or nav-only.
- **CTA target:** `/shop?category=Women` — no new "Bridal" product category or data changes. This page is a pure editorial/lookbook page, not a filtered shop view.

## Assets

- 20 frames, `1280×720`, RGBA PNG, ~1MB each (~24MB total), at `public/images/animation1/frame_NNN.png` (3-digit zero-padded, `001`–`020`).
- No image reprocessing/compression of the source frames is in scope — noted as a known perf cost, accepted because it's a dedicated page (not loaded on the homepage) and preload is gated behind a loading state.

## Architecture

```
src/app/bridal/page.tsx              ← route: hero → story → CTA → shared Footer
src/components/bridal/
  bridal-hero.tsx                    ← canvas scroll-scrub hero (client component)
  bridal-story.tsx                   ← short editorial copy block
  bridal-cta.tsx                     ← "Shop the Edit" CTA -> /shop?category=Women
src/components/home/
  bridal-promo.tsx                   ← homepage promo banner -> /bridal
src/app/page.tsx                     ← wire <BridalPromo /> in after <CategoryGrid />
```

Reuses existing tokens/components only: `luxe-gold` (#C9A96E), `luxe-ink`, `font-serif`/`font-mono` pairing, `.eyebrow` class, `BlurFade`, `ShimmerButton`. No new dependencies — `gsap`, `@gsap/react`, `ScrollTrigger`, and `lenis` are already installed and globally wired via `SmoothScroll`.

## Hero scroll-scrub mechanics (`bridal-hero.tsx`)

- **Preload:** on mount, load all 20 frames into `HTMLImageElement`s (`new Image()`), tracking progress. Until preload completes, show a loading overlay (mono label + thin gold progress bar) instead of the scrub interaction.
- **Markup:** `<section id="hero">` — the `id="hero"` is intentional: `Navbar` already does `document.getElementById("hero")` via `IntersectionObserver` to decide when to go transparent-over-hero, and that effect re-runs per-pathname, so this hero gets that transparent-nav behavior for free, matching the homepage hero.
- **Pin distance:** wrapper height `400vh` (long enough to scrub 20 frames smoothly, short enough to not drag). Inner `sticky top-0 h-screen` holds a full-bleed `<canvas>`.
- **Scrub:** a single `ScrollTrigger` pins the wrapper (`start: "top top"`, `end: "bottom bottom"`) and on `onUpdate`, maps scroll progress `0–1` → frame index `0–19` (`Math.round(progress * 19)`), redrawing only when the index changes. Canvas draw uses cover-fit math (scale + center-crop the 1280×720 source to the canvas/viewport size), analogous to the crossfade sizing already done in `Hero.tsx`.
- **Overlay UI:** mono eyebrow ("THE BRIDAL COLLECTION"), serif headline, and a scroll hint fade in near the start of the pin (entrance via `framer-motion`, matching `Hero.tsx`'s pattern) and persist through the scrub.
- **Reduced motion:** `prefers-reduced-motion: reduce` → skip preloading and `ScrollTrigger` pin entirely; render a static, non-pinned hero using `frame_001.png` as a plain full-bleed image with the same overlay UI.
- **Resize:** canvas redraws on window resize (recompute cover-fit + redraw current frame); `ScrollTrigger.refresh()` on resize is handled by GSAP's default resize observer.

## Page content

- `BridalHero` → `BridalStory` (one short serif paragraph, editorial tone, `BlurFade`-in on scroll, same rhythm as `CategoryGrid` intro copy) → `BridalCTA` (`ShimmerButton`-style CTA linking to `/shop?category=Women`) → shared `Footer`.

## Homepage promo (`bridal-promo.tsx`)

- Full-width banner section placed after `CategoryGrid` in `src/app/page.tsx`.
- Background: one representative frame from the sequence (e.g. `frame_010.png`) as a static `<img>`/`Photo`-style cover image (no canvas/animation needed here — it's a static teaser).
- Content: serif "The Bridal Edit" heading + mono "Discover the Collection" link, entrance via `motion`/`BlurFade` on scroll into view (`whileInView`, `once: true`), consistent with `CategoryGrid`'s card animation.
- Links to `/bridal`.

## Testing / verification

- `tsc --noEmit` clean.
- Manual/Playwright drive: navigate to `/bridal`, confirm loading overlay appears then clears, scroll through the pinned hero and confirm the canvas advances through frames, confirm navbar goes transparent over the hero and solid after it, confirm story + CTA render, confirm CTA navigates to `/shop?category=Women`.
- From `/`, confirm the new promo section renders after `CategoryGrid` and its link navigates to `/bridal`.
- Reduced-motion check: emulate `prefers-reduced-motion: reduce` on `/bridal` and confirm a static hero renders with no canvas/pin/preload.

## Out of scope

- Adding a "Bridal" product category or bridal-specific product data.
- Compressing/re-encoding the source frame PNGs.
- Reusing this canvas-scrub pattern elsewhere (e.g. product pages) — this spec covers the bridal page only.
