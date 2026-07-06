# Remotion Brand Film — Design Spec

**Date:** 2026-07-06
**Status:** Approved (Phase 1 of 3)
**Phases:** 1. Foundation + brand film (this spec) → 2. Animated product showcase → 3. Interactive lookbook player

## Goal

Add Remotion to the LUXE storefront and ship a cinematic, code-rendered "SS26 brand film" as a full-bleed homepage section. The film is an ambient, muted, seamlessly looping ~20s composition played live by `@remotion/player` — no video files, no render pipeline. It establishes the shared Remotion foundation (`src/remotion/`, motion language) that Phases 2 and 3 build on.

## Decisions (locked)

- **Use case:** cinematic brand film section (Phases 2/3 deferred to separate specs).
- **Playback:** ambient auto-loop — plays muted when in view, pauses off-screen, loops seamlessly, no visible controls.
- **Placement:** homepage, immediately after `MarqueeBanner`, between `NewArrivals` and `Bestsellers`.
- **Runtime:** Approach A — live `@remotion/player` composition, lazy-loaded. Not pre-rendered MP4, not hybrid.

## Architecture

```
src/remotion/                      ← Remotion world (imports only src/data + design tokens, never site components)
  brand-film/
    composition.tsx                ← <BrandFilm> root composition
    scenes/
      title-card.tsx
      look-montage.tsx
      product-ticker.tsx
      outro.tsx
    motion.ts                      ← shared easings, springs, timing constants ("LUXE motion language")
src/components/home/
  brand-film-section.tsx           ← site-facing section: chrome + poster + lazy <Player> mount
```

**Boundary rule:** the site imports the composition only through `brand-film-section.tsx`; the composition never imports site components. `motion.ts` is the reusable seed for Phases 2/3.

## Composition spec

- 1920×1080, 30fps, ~20s total (~600 frames), designed as an invisible loop (last frames resolve to the visual state of frame 0).
- Visual language: existing tokens only — `luxe-gold` (#C9A96E), `luxe-ink`, luxe-bg/paper, the site's serif/mono pairing. Film-grain overlay for texture.

### Scenes

1. **Title card (~4s):** "LUXE / The Art of Movement / SS26" kinetic serif typography; letters track in over a gold gradient; film grain.
2. **Look montage (~8s):** `/images/hero-main.png`, `/images/hero-aside.png`, `/images/look-01.png` with slow Ken Burns zooms, hard editorial cuts, oversized scene numbers (01/02/03) wiping across.
3. **Product ticker (~5s):** 3–4 real products from `src/data/products.ts` (name, price, category) as animated typographic cards over blurred imagery.
4. **Outro / loop seam (~3s):** "Spring / Summer 2026" resolves back into frame 0's visual state.

## Section behavior & performance

- `brand-film-section.tsx` renders section chrome (mono eyebrow + serif heading, matching `NewArrivals` styling) and a 16:9 full-bleed frame.
- `<Player>` loaded via `next/dynamic` with `ssr: false`; mounted only when an IntersectionObserver reports the section within ~1 viewport of entering. Until then a static poster (first frame's key image + CSS gradient) holds the space — zero Remotion JS in the initial bundle.
- Visibility drives playback: in view → `play()`, out of view → `pause()`. Player props: `autoPlay`, `muted`, `loop`, controls hidden.
- `prefers-reduced-motion: reduce` → player never mounts; poster remains.
- Failed chunk load → poster remains; no error UI.

## Dependencies & constraints

- Add `remotion` and `@remotion/player`, **pinned to the exact same version** (Remotion requirement).
- This Next.js version has breaking changes (per AGENTS.md): read `node_modules/next/dist/docs/` before wiring `next/dynamic`; fetch current Remotion Player API docs via context7 before coding.

## Testing / verification

- `tsc --noEmit` clean.
- Playwright drive: scroll homepage to the section; assert the player mounts, current frame advances over time, and playback pauses when scrolled away. Screenshot for visual confirmation.
- Reduced-motion check: emulate `prefers-reduced-motion` and assert the player never mounts.

## Out of scope (later phases)

- Per-product showcase loops (Phase 2).
- Interactive chaptered lookbook player with timeline-synced CTAs (Phase 3).
- Server-side/CI MP4 rendering.
