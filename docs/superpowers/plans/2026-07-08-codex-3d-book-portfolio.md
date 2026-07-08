# The Codex — 3D Book Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a single interactive WebGL "book" whose parchment pages bend as the user scrolls, with a graceful non-WebGL fallback for mobile and reduced-motion users.

**Architecture:** A new `src/book/` presentation layer wraps the existing content/data. A React-Three-Fiber `<BookCanvas>` renders a book of subdivided plane "pages" that bend via a vertex shader driven by scroll progress. Interactive content (links, live GitHub calendar) renders as real DOM through drei `<Html>` on the settled/open spread only; turning pages render as parchment textures. A `useBookMode` hook swaps the whole 3D layer for stacked parchment cards on small screens or when reduced-motion is requested. Existing `src/data/*` is reused unchanged; existing `src/sections/*` are refactored into mode-neutral content components.

**Tech Stack:** React 19, TypeScript, Vite 7, `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion` (existing), Vitest + jsdom (new, for pure-logic tests).

## Global Constraints

- React 19 + Vite 7 + TypeScript (`~5.9.3`), ESM only (`"type": "module"`) — verbatim from `package.json`.
- All colors come from CSS custom properties in `src/theme/tokens.css` (`--bg`, `--fg`, `--accent-2`, etc.); new parchment/gold tokens are added there, never hard-coded per component (except inside WebGL materials, which cannot read CSS vars — those read resolved values via `getComputedStyle`).
- Fonts already loaded in `tokens.css`: `'Syne'` (display), `'DM Sans'` (body), `'Fira Code'` (mono). Do not add font imports.
- Respect `prefers-reduced-motion`: no page-turn animation; render fallback cards.
- WebGL book only mounts at viewport width ≥ 820px AND when reduced-motion is NOT set. Below that, render fallback cards.
- Every task must end with `npm run build` passing (`tsc -b && vite build`) and `npm run lint` clean. Pure-logic tasks additionally run `npm run test`.
- Preserve all current content: intro, GitHub calendar (`react-github-calendar`, username `moi-script`), 4 story acts, 5 projects, About modules + facts, Contact links, CV download (`/Moises_Nugal_CV_Polished.docx`).
- Commit after every task with a Conventional-Commits message ending:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## File Structure

**New — pure logic (unit-tested with Vitest):**
- `src/book/pageMath.ts` — `clamp`, `pageProgressToTurn`, `easeSettle`, `nearestSpread`
- `src/book/useBookMode.ts` — `resolveBookMode(width, reducedMotion)` + `useBookMode()` hook
- `src/book/navMap.ts` — `SECTION_TO_PAGE`, `pageForSection`, `sectionForPage`
- `src/book/pageMath.test.ts`, `src/book/useBookMode.test.ts`, `src/book/navMap.test.ts`

**New — WebGL / R3F (build + manual verification):**
- `src/book/pageShader.ts` — parchment bend `ShaderMaterial` factory
- `src/book/parchment.ts` — canvas-generated parchment `CanvasTexture`
- `src/book/Backdrop.tsx` — candlelit vignette + dust motes
- `src/book/Page.tsx` — one bending page (mesh + optional `<Html>` content)
- `src/book/Book.tsx` — book group: pages, cover, spine, gold corners
- `src/book/BookCanvas.tsx` — R3F `<Canvas>`, camera, lights, scroll scrub
- `src/book/pages.tsx` — `PAGES: PageDef[]` mapping spreads → content components

**New — content components (mode-neutral, used by both `<Html>` and cards):**
- `src/book/content/ProfileMedallion.tsx`
- `src/book/content/IntroContent.tsx`
- `src/book/content/LedgerContent.tsx`
- `src/book/content/StoryContent.tsx`
- `src/book/content/WorkContent.tsx`
- `src/book/content/AboutContent.tsx`
- `src/book/content/ContactContent.tsx`

**New — fallback:**
- `src/book/FallbackBook.tsx` — stacked spreads
- `src/book/ParchmentCard.tsx` — parchment-styled card wrapper
- `src/book/NavOverlay.tsx` — fixed nav (adapted from `src/components/Nav.tsx`), section→page jumps

**Modified:**
- `src/App.tsx` — mode switch (webgl book vs fallback), lazy-load canvas
- `src/theme/tokens.css` — add parchment/gold tokens
- `vite.config.ts` — add Vitest test config
- `package.json` — add deps + `test` script

**Reused unchanged:** `src/data/projects.ts`, `src/data/story.ts`, `src/theme/ThemeContext.tsx`, `src/components/ThemeToggle.tsx`, `src/components/Reveal.tsx`, `src/assets/profile_pic_5.png`.

---

## Task 1: Project setup — dependencies, Vitest, tokens

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `src/theme/tokens.css`
- Create: `src/book/setup.test.ts` (smoke test, deleted at end of task)

**Interfaces:**
- Consumes: nothing.
- Produces: `three`, `@react-three/fiber`, `@react-three/drei` importable; `npm run test` runs Vitest in jsdom; new CSS tokens `--parchment`, `--parchment-edge`, `--ink`, `--ink-muted`, `--gold`, `--gold-deep`, `--wood`, `--room-bg`.

- [ ] **Step 1: Install runtime and test dependencies**

Run:
```bash
npm install three@^0.169.0 @react-three/fiber@^9.0.0 @react-three/drei@^9.114.0
npm install -D vitest@^2.1.0 jsdom@^25.0.0 @types/three@^0.169.0
```
Expected: installs succeed, `package.json` gains the deps. (If `@react-three/fiber@9` reports a peer conflict with React 19, it should not — fiber 9 targets React 19; if npm errors on peers, re-run with `--legacy-peer-deps` and note it in the commit body.)

- [ ] **Step 2: Add the `test` script**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Configure Vitest in vite config**

Replace `vite.config.ts` with:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 4: Add parchment/gold tokens**

In `src/theme/tokens.css`, inside the existing `:root, :root[data-theme="light"]` block AND the `:root[data-theme="dark"]` block, the *book* palette is intentionally theme-independent (warm book in a dark room in both themes). Add this new block AFTER the `--on-image` block (near line 40), before `* { box-sizing: border-box; }`:
```css
/* Book palette — warm, theme-independent (the book looks the same in a dark room
   regardless of light/dark site theme). Used by parchment cards and read via
   getComputedStyle by WebGL materials. */
:root {
  --parchment: #e9d6ad;
  --parchment-edge: #cdb488;
  --ink: #3a2c17;
  --ink-muted: #6b5636;
  --gold: #f2c14e;
  --gold-deep: #b8860b;
  --wood: #6b4a2b;
  --room-bg: #0a0705;
}
```

- [ ] **Step 5: Write a smoke test to prove Vitest + three import work**

Create `src/book/setup.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { MathUtils } from 'three'

describe('setup', () => {
  it('runs vitest and can import three', () => {
    expect(MathUtils.clamp(5, 0, 3)).toBe(3)
  })
})
```

- [ ] **Step 6: Run the smoke test**

Run: `npm run test`
Expected: PASS, 1 test passing.

- [ ] **Step 7: Verify build and lint still pass**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 8: Delete the smoke test and commit**

Delete `src/book/setup.test.ts`.
```bash
git add package.json package-lock.json vite.config.ts src/theme/tokens.css
git commit -m "chore: add three/r3f/drei + vitest and book palette tokens

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Page math (pure, TDD)

**Files:**
- Create: `src/book/pageMath.ts`
- Test: `src/book/pageMath.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `clamp(v: number, min: number, max: number): number`
  - `pageProgressToTurn(progress: number, pageIndex: number): number` — global scroll progress (0…N, where crossing integer k means page k finishes turning) → this page's turn amount in `[0,1]` (0 = lying on the right, 1 = fully turned to the left).
  - `easeSettle(t: number): number` — smoothstep-style ease for the settle animation, `[0,1] → [0,1]`.
  - `nearestSpread(progress: number): number` — rounds a fractional progress to the nearest settled integer spread.

- [ ] **Step 1: Write the failing tests**

Create `src/book/pageMath.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { clamp, pageProgressToTurn, easeSettle, nearestSpread } from './pageMath'

describe('clamp', () => {
  it('clamps below, within, above', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(99, 0, 10)).toBe(10)
  })
})

describe('pageProgressToTurn', () => {
  it('page not yet reached is flat (0)', () => {
    expect(pageProgressToTurn(0.0, 2)).toBe(0)
    expect(pageProgressToTurn(1.9, 2)).toBe(0)
  })
  it('page fully turned once progress passes it', () => {
    expect(pageProgressToTurn(3.0, 2)).toBe(1)
    expect(pageProgressToTurn(5.0, 2)).toBe(1)
  })
  it('page mid-turn returns the fractional progress', () => {
    expect(pageProgressToTurn(2.25, 2)).toBeCloseTo(0.25, 5)
    expect(pageProgressToTurn(2.75, 2)).toBeCloseTo(0.75, 5)
  })
})

describe('easeSettle', () => {
  it('pins endpoints and is monotonic in the middle', () => {
    expect(easeSettle(0)).toBe(0)
    expect(easeSettle(1)).toBe(1)
    expect(easeSettle(0.5)).toBeCloseTo(0.5, 5)
    expect(easeSettle(0.25)).toBeLessThan(0.25)
  })
})

describe('nearestSpread', () => {
  it('rounds to the nearest integer spread', () => {
    expect(nearestSpread(2.2)).toBe(2)
    expect(nearestSpread(2.6)).toBe(3)
    expect(nearestSpread(0.49)).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- pageMath`
Expected: FAIL — cannot find module `./pageMath`.

- [ ] **Step 3: Implement `pageMath.ts`**

Create `src/book/pageMath.ts`:
```ts
export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

/**
 * Global scroll progress runs 0…N. Page `pageIndex` turns as progress crosses
 * pageIndex → pageIndex+1. Returns this page's turn amount in [0,1].
 */
export function pageProgressToTurn(progress: number, pageIndex: number): number {
  return clamp(progress - pageIndex, 0, 1)
}

/** Smoothstep ease, [0,1] → [0,1], symmetric about 0.5. */
export function easeSettle(t: number): number {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

/** Nearest settled integer spread for a fractional progress. */
export function nearestSpread(progress: number): number {
  return Math.round(progress)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- pageMath`
Expected: PASS (all cases).

- [ ] **Step 5: Verify build + lint, then commit**

Run: `npm run build && npm run lint`
```bash
git add src/book/pageMath.ts src/book/pageMath.test.ts
git commit -m "feat: add page-turn math helpers

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Book mode selection (pure, TDD)

**Files:**
- Create: `src/book/useBookMode.ts`
- Test: `src/book/useBookMode.test.ts`

**Interfaces:**
- Consumes: nothing (the pure fn); the hook uses `window.matchMedia` + `innerWidth`.
- Produces:
  - `type BookMode = 'webgl' | 'cards'`
  - `resolveBookMode(width: number, reducedMotion: boolean): BookMode` — `'cards'` if `width < 820` or `reducedMotion`, else `'webgl'`.
  - `useBookMode(): BookMode` — React hook that re-evaluates on resize and on reduced-motion changes.

- [ ] **Step 1: Write the failing tests**

Create `src/book/useBookMode.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { resolveBookMode } from './useBookMode'

describe('resolveBookMode', () => {
  it('uses cards on narrow screens', () => {
    expect(resolveBookMode(500, false)).toBe('cards')
    expect(resolveBookMode(819, false)).toBe('cards')
  })
  it('uses cards when reduced motion is requested, even on wide screens', () => {
    expect(resolveBookMode(1440, true)).toBe('cards')
  })
  it('uses the webgl book on wide screens without reduced motion', () => {
    expect(resolveBookMode(820, false)).toBe('webgl')
    expect(resolveBookMode(1920, false)).toBe('webgl')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- useBookMode`
Expected: FAIL — cannot find module `./useBookMode`.

- [ ] **Step 3: Implement `useBookMode.ts`**

Create `src/book/useBookMode.ts`:
```ts
import { useEffect, useState } from 'react'

export type BookMode = 'webgl' | 'cards'

export const BOOK_MIN_WIDTH = 820

export function resolveBookMode(width: number, reducedMotion: boolean): BookMode {
  if (reducedMotion) return 'cards'
  if (width < BOOK_MIN_WIDTH) return 'cards'
  return 'webgl'
}

function readMode(): BookMode {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const width = typeof window !== 'undefined' ? window.innerWidth : 1440
  return resolveBookMode(width, reduced)
}

export function useBookMode(): BookMode {
  const [mode, setMode] = useState<BookMode>(readMode)

  useEffect(() => {
    const update = () => setMode(readMode())
    window.addEventListener('resize', update)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      mq.removeEventListener('change', update)
    }
  }, [])

  return mode
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- useBookMode`
Expected: PASS.

- [ ] **Step 5: Verify build + lint, then commit**

Run: `npm run build && npm run lint`
```bash
git add src/book/useBookMode.ts src/book/useBookMode.test.ts
git commit -m "feat: add book mode selection (webgl vs cards)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Nav → page mapping (pure, TDD)

**Files:**
- Create: `src/book/navMap.ts`
- Test: `src/book/navMap.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type SectionId = 'intro' | 'story' | 'work' | 'about' | 'contact'`
  - `SPREADS: readonly SectionId[]` — the ordered spread → section list (drives page count).
  - `pageForSection(section: SectionId): number` — index of the first spread showing that section.
  - `sectionForPage(page: number): SectionId` — section shown at a given spread index (clamped).

The spread order is fixed by the design page map: `intro`(1), `ledger`→treated as part of intro nav target, `story` A/B, `work`, `about`, `contact`. For nav purposes we expose the five nav sections. Full ordered spread list including cover and ledger:
`['cover','intro','ledger','story','story','work','about','contact','back']`.

- [ ] **Step 1: Write the failing tests**

Create `src/book/navMap.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { SPREADS, pageForSection, sectionForPage } from './navMap'

describe('SPREADS', () => {
  it('starts at cover and ends at back', () => {
    expect(SPREADS[0]).toBe('cover')
    expect(SPREADS[SPREADS.length - 1]).toBe('back')
  })
  it('contains the five nav sections', () => {
    for (const s of ['intro', 'story', 'work', 'about', 'contact'] as const) {
      expect(SPREADS).toContain(s)
    }
  })
})

describe('pageForSection', () => {
  it('returns the first spread index for a section', () => {
    expect(pageForSection('intro')).toBe(SPREADS.indexOf('intro'))
    expect(pageForSection('work')).toBe(SPREADS.indexOf('work'))
    expect(pageForSection('story')).toBe(SPREADS.indexOf('story'))
  })
})

describe('sectionForPage', () => {
  it('maps a page index back to its section', () => {
    expect(sectionForPage(0)).toBe('cover')
    expect(sectionForPage(SPREADS.indexOf('about'))).toBe('about')
  })
  it('clamps out-of-range indices', () => {
    expect(sectionForPage(-5)).toBe('cover')
    expect(sectionForPage(999)).toBe('back')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- navMap`
Expected: FAIL — cannot find module `./navMap`.

- [ ] **Step 3: Implement `navMap.ts`**

Create `src/book/navMap.ts`:
```ts
export type SectionId =
  | 'cover'
  | 'intro'
  | 'ledger'
  | 'story'
  | 'work'
  | 'about'
  | 'contact'
  | 'back'

/** Ordered list of spreads. Index === page index used by the book. */
export const SPREADS: readonly SectionId[] = [
  'cover',
  'intro',
  'ledger',
  'story', // acts 01–02
  'story', // acts 03–04
  'work',
  'about',
  'contact',
  'back',
] as const

export function pageForSection(section: SectionId): number {
  const i = SPREADS.indexOf(section)
  return i < 0 ? 0 : i
}

export function sectionForPage(page: number): SectionId {
  const clamped = Math.max(0, Math.min(SPREADS.length - 1, Math.round(page)))
  return SPREADS[clamped]
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- navMap`
Expected: PASS.

- [ ] **Step 5: Verify build + lint, then commit**

Run: `npm run build && npm run lint`
```bash
git add src/book/navMap.ts src/book/navMap.test.ts
git commit -m "feat: add nav section to page-index mapping

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Parchment texture generator

**Files:**
- Create: `src/book/parchment.ts`

**Interfaces:**
- Consumes: `three`.
- Produces: `makeParchmentTexture(size?: number): THREE.CanvasTexture` — a warm, seamless-ish parchment texture drawn on a `<canvas>`. Reads `--parchment` / `--parchment-edge` via `getComputedStyle(document.documentElement)` with hard-coded fallbacks so it works in tests/SSR.

- [ ] **Step 1: Implement the generator**

Create `src/book/parchment.ts`:
```ts
import { CanvasTexture, SRGBColorSpace } from 'three'

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

/**
 * Draws a warm parchment texture: base fill + soft blotches + subtle grain.
 * Returned texture is ready to use as a material map.
 */
export function makeParchmentTexture(size = 1024): CanvasTexture {
  const base = cssVar('--parchment', '#e9d6ad')
  const edge = cssVar('--parchment-edge', '#cdb488')

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!

  // base
  ctx.fillStyle = base
  ctx.fillRect(0, 0, size, size)

  // soft blotches
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = size * (0.05 + Math.random() * 0.12)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `${edge}22`)
    g.addColorStop(1, '#00000000')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // fine grain
  const grain = ctx.getImageData(0, 0, size, size)
  const d = grain.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 14
    d[i] += n
    d[i + 1] += n
    d[i + 2] += n
  }
  ctx.putImageData(grain, 0, 0)

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.anisotropy = 8
  return tex
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds (this module is not yet imported anywhere; that is fine — Vite tree-shakes it until Task 7 uses it). Lint clean.

- [ ] **Step 3: Commit**

```bash
git add src/book/parchment.ts
git commit -m "feat: add canvas parchment texture generator

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Bending page shader material

**Files:**
- Create: `src/book/pageShader.ts`

**Interfaces:**
- Consumes: `three`, `makeParchmentTexture` from Task 5.
- Produces: `makePageMaterial(map: THREE.Texture): THREE.ShaderMaterial` — a double-sided material with a `uTurn` uniform in `[0,1]`. `uTurn = 0` lies flat on the right of the spine; `uTurn = 1` is fully rotated to the left. Adds a slight paper curl so the free edge lifts. The plane is authored spanning x ∈ `[0, W]` with the spine at `x = 0`.
- Constant: `PAGE_WIDTH = 3`, `PAGE_HEIGHT = 4`, `PAGE_SEGMENTS = 24`.

- [ ] **Step 1: Implement the shader material**

Create `src/book/pageShader.ts`:
```ts
import { DoubleSide, ShaderMaterial, type Texture } from 'three'

export const PAGE_WIDTH = 3
export const PAGE_HEIGHT = 4
export const PAGE_SEGMENTS = 24

const vertex = /* glsl */ `
  uniform float uTurn;      // 0 = flat right, 1 = flat left
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vUv = uv;
    vec3 p = position;      // x in [0, W], spine at x = 0

    float angle = uTurn * ${Math.PI.toFixed(6)};   // rotate around spine (y-axis)
    // paper curl: mid-turn the free edge lifts; zero at the ends
    float curl = sin(uTurn * ${Math.PI.toFixed(6)}) * 0.35;
    float t = p.x / ${PAGE_WIDTH.toFixed(1)};       // 0 at spine, 1 at free edge

    // rotate the point around the spine (x=0) about the vertical axis
    float c = cos(angle);
    float s = sin(angle);
    float x = p.x * c;
    float z = -p.x * s;

    // add curl bulge in local normal direction (lift in z), strongest mid-page
    z += curl * sin(t * ${Math.PI.toFixed(6)});

    vec3 transformed = vec3(x, p.y, z);
    vShade = 0.85 + 0.15 * (1.0 - abs(uTurn - 0.5) * 2.0); // subtle sheen mid-turn
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying float vShade;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    gl_FragColor = vec4(tex.rgb * vShade, 1.0);
  }
`

export function makePageMaterial(map: Texture): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uTurn: { value: 0 },
      uMap: { value: map },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: DoubleSide,
  })
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean. (Not yet imported; used in Task 7.)

- [ ] **Step 3: Commit**

```bash
git add src/book/pageShader.ts
git commit -m "feat: add bending page shader material

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Single bending page + canvas + scroll scrub (Phase 1 milestone)

**Files:**
- Create: `src/book/Page.tsx`
- Create: `src/book/Backdrop.tsx`
- Create: `src/book/BookCanvas.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `pageProgressToTurn`, `PAGE_WIDTH/HEIGHT/SEGMENTS`, `makePageMaterial`, `makeParchmentTexture`.
- Produces:
  - `<Page turn={number} z={number}>` — a single bending page mesh. `turn` drives `uTurn`; `z` offsets stacking depth. Children (optional) reserved for later `<Html>`.
  - `<Backdrop />` — dark room + warm point light + faint dust.
  - `<BookCanvas />` — full-viewport fixed R3F canvas; owns scroll→progress; for this milestone renders one `<Page>` whose `turn` follows `pageProgressToTurn(progress, 0)`. Total scrollable height = `(pageCount + 1) * 100vh`, here `pageCount = 1`.

- [ ] **Step 1: Implement `Page.tsx`**

Create `src/book/Page.tsx`:
```tsx
import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial } from 'three'
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_SEGMENTS,
  makePageMaterial,
} from './pageShader'
import { makeParchmentTexture } from './parchment'

export function Page({
  turn,
  z = 0,
  children,
}: {
  turn: number
  z?: number
  children?: ReactNode
}) {
  const meshRef = useRef<Mesh>(null)
  const material = useMemo(() => makePageMaterial(makeParchmentTexture()), [])

  useFrame(() => {
    const m = meshRef.current?.material as ShaderMaterial | undefined
    if (m) m.uniforms.uTurn.value = turn
  })

  return (
    <mesh ref={meshRef} position={[0, 0, z]} material={material}>
      {/* plane spans x in [0, W] with spine at x=0: translate so left edge = 0 */}
      <planeGeometry
        args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_SEGMENTS, 1]}
        onUpdate={(g) => g.translate(PAGE_WIDTH / 2, 0, 0)}
      />
      {children}
    </mesh>
  )
}
```

- [ ] **Step 2: Implement `Backdrop.tsx`**

Create `src/book/Backdrop.tsx`:
```tsx
import { useMemo } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'

function Dust() {
  const geo = useMemo(() => {
    const g = new BufferGeometry()
    const n = 120
    const pos: number[] = []
    for (let i = 0; i < n; i++) {
      pos.push((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6)
    }
    g.setAttribute('position', new Float32BufferAttribute(pos, 3))
    return g
  }, [])
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.03} color="#f2c14e" transparent opacity={0.4} />
    </points>
  )
}

export function Backdrop() {
  return (
    <>
      <color attach="background" args={['#0a0705']} />
      <fog attach="fog" args={['#0a0705', 8, 18]} />
      <ambientLight intensity={0.35} color="#ffe9c2" />
      <pointLight position={[3, 4, 6]} intensity={40} color="#ffd9a0" distance={30} decay={2} />
      <pointLight position={[-4, 2, 4]} intensity={12} color="#88bbff" distance={25} decay={2} />
      <Dust />
    </>
  )
}
```

- [ ] **Step 3: Implement `BookCanvas.tsx`**

Create `src/book/BookCanvas.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Backdrop } from './Backdrop'
import { Page } from './Page'
import { pageProgressToTurn } from './pageMath'

const PAGE_COUNT = 1 // Phase 1: single page. Grows in Task 8.

export function BookCanvas() {
  const [progress, setProgress] = useState(0)
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? (window.scrollY / max) * PAGE_COUNT : 0
      scrollRef.current = p
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* tall spacer drives scrolling; canvas is fixed behind it */}
      <div style={{ height: `${(PAGE_COUNT + 1) * 100}vh` }} aria-hidden />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [1.2, 0, 8], fov: 40 }}>
          <Backdrop />
          <Page turn={pageProgressToTurn(progress, 0)} />
        </Canvas>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Temporarily mount the canvas in `App.tsx`**

Replace `src/App.tsx` with:
```tsx
import { BookCanvas } from './book/BookCanvas'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--room-bg)', overflowX: 'hidden' }}>
      <BookCanvas />
    </div>
  )
}
```
(The old sections are re-introduced through the book in later tasks; this is the Phase 1 proof.)

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 6: Manual browser verification**

Run: `npm run dev`, open the local URL. Verify:
- A single parchment page is visible, lit warmly against a dark room with faint gold dust.
- Scrolling down rotates the page around its left (spine) edge from right to left, with a slight mid-turn curl.
- At the top the page lies flat-right (`turn ≈ 0`); scrolled to bottom it is fully turned left (`turn ≈ 1`).
- No console errors; motion is smooth.

Record the result (pass/fail + notes) in the commit body.

- [ ] **Step 7: Commit**

```bash
git add src/book/Page.tsx src/book/Backdrop.tsx src/book/BookCanvas.tsx src/App.tsx
git commit -m "feat: render a single bending page driven by scroll scrub

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Multi-page book stack (Phase 2 milestone)

**Files:**
- Create: `src/book/Book.tsx`
- Modify: `src/book/BookCanvas.tsx`

**Interfaces:**
- Consumes: `Page`, `pageProgressToTurn`, `SPREADS` (from `navMap`).
- Produces: `<Book progress={number} />` — renders one `<Page>` per spread in `SPREADS`, each with `turn = pageProgressToTurn(progress, i)` and a small `z` offset so the stack has thickness. `BookCanvas` now scrolls across `SPREADS.length` pages.

- [ ] **Step 1: Implement `Book.tsx`**

Create `src/book/Book.tsx`:
```tsx
import { Page } from './Page'
import { pageProgressToTurn } from './pageMath'
import { SPREADS } from './navMap'

const Z_STEP = 0.01

export function Book({ progress }: { progress: number }) {
  return (
    <group>
      {SPREADS.map((_, i) => {
        const turn = pageProgressToTurn(progress, i)
        // pages already turned stack toward the viewer on the left; unturned on the right
        const z = (turn > 0.5 ? i : SPREADS.length - i) * Z_STEP
        return <Page key={i} turn={turn} z={z} />
      })}
    </group>
  )
}
```

- [ ] **Step 2: Update `BookCanvas.tsx` to use `<Book>` and scroll all pages**

In `src/book/BookCanvas.tsx`:
- Remove the `import { Page }` and `import { pageProgressToTurn }` lines; add `import { Book } from './Book'` and `import { SPREADS } from './navMap'`.
- Replace `const PAGE_COUNT = 1 ...` with `const PAGE_COUNT = SPREADS.length`.
- Replace `<Page turn={pageProgressToTurn(progress, 0)} />` with `<Book progress={progress} />`.

Resulting relevant lines:
```tsx
import { Book } from './Book'
import { SPREADS } from './navMap'
// ...
const PAGE_COUNT = SPREADS.length
// ...
        <Canvas camera={{ position: [1.2, 0, 8], fov: 40 }}>
          <Backdrop />
          <Book progress={progress} />
        </Canvas>
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`. Verify:
- A stack of parchment pages with visible thickness.
- Scrolling turns pages one after another (page 0, then 1, then 2 …) across the full scroll height.
- At any moment at most one page is mid-turn; the rest are flat left or flat right.
- No console errors; smooth.

- [ ] **Step 5: Commit**

```bash
git add src/book/Book.tsx src/book/BookCanvas.tsx
git commit -m "feat: render full multi-page book turning on scroll

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Book chrome — cover, spine, gold corners

**Files:**
- Create: `src/book/BookChrome.tsx`
- Modify: `src/book/Book.tsx`

**Interfaces:**
- Consumes: `three`, `PAGE_WIDTH`, `PAGE_HEIGHT`.
- Produces: `<BookChrome />` — static geometry behind the pages: a wooden back board spanning both halves, a spine block at the center, and four gold corner caps. Rendered once by `<Book>`.

- [ ] **Step 1: Implement `BookChrome.tsx`**

Create `src/book/BookChrome.tsx`:
```tsx
import { PAGE_WIDTH, PAGE_HEIGHT } from './pageShader'

const WOOD = '#6b4a2b'
const GOLD = '#f2c14e'

function GoldCorner({ x, y }: { x: number; y: number }) {
  return (
    <mesh position={[x, y, -0.05]}>
      <boxGeometry args={[0.5, 0.5, 0.12]} />
      <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
    </mesh>
  )
}

export function BookChrome() {
  const halfW = PAGE_WIDTH
  const cx = halfW // corners near outer edges of the open spread
  const cy = PAGE_HEIGHT / 2 - 0.1
  return (
    <group position={[0, 0, -0.1]}>
      {/* wooden back board spanning both pages, slightly larger than the paper */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[PAGE_WIDTH * 2 + 0.5, PAGE_HEIGHT + 0.5, 0.2]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* spine */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.18, PAGE_HEIGHT + 0.5, 0.24]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* gold corner caps on the two outer corners of each side */}
      <GoldCorner x={-cx} y={cy} />
      <GoldCorner x={-cx} y={-cy} />
      <GoldCorner x={cx} y={cy} />
      <GoldCorner x={cx} y={-cy} />
    </group>
  )
}
```

- [ ] **Step 2: Render chrome inside `<Book>`**

In `src/book/Book.tsx`, add `import { BookChrome } from './BookChrome'` and render it as the first child of the `<group>`:
```tsx
  return (
    <group>
      <BookChrome />
      {SPREADS.map((_, i) => {
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`. Verify a wooden board frames the pages, a spine runs down the center, and four gold corner caps sit at the outer corners and catch the light. Pages still turn over the board. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/book/BookChrome.tsx src/book/Book.tsx
git commit -m "feat: add wooden board, spine, and gold corner caps

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: Content components (refactor sections, mode-neutral)

**Files:**
- Create: `src/book/content/ProfileMedallion.tsx`
- Create: `src/book/content/IntroContent.tsx`
- Create: `src/book/content/LedgerContent.tsx`
- Create: `src/book/content/StoryContent.tsx`
- Create: `src/book/content/WorkContent.tsx`
- Create: `src/book/content/AboutContent.tsx`
- Create: `src/book/content/ContactContent.tsx`

**Interfaces:**
- Consumes: `src/data/projects.ts`, `src/data/story.ts`, `src/assets/profile_pic_5.png`, `react-github-calendar`, `useTheme`.
- Produces: seven presentational components. Each renders on a `--parchment`/`--ink` surface with **dark ink text** (they sit on parchment, not the dark site theme). No fixed positioning, no viewport units for their own size — they fill their parent. Signatures:
  - `<ProfileMedallion size={number} />`
  - `<IntroContent />`, `<LedgerContent />`, `<StoryContent part={1 | 2} />`, `<WorkContent />`, `<AboutContent />`, `<ContactContent />`

Each spread is authored to fit a page; `StoryContent` takes `part` (1 = acts 01–02, 2 = acts 03–04).

- [ ] **Step 1: Implement `ProfileMedallion.tsx`**

Create `src/book/content/ProfileMedallion.tsx`:
```tsx
import profilePic from '../../assets/profile_pic_5.png'

export function ProfileMedallion({ size = 180 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        padding: 6,
        background: 'radial-gradient(circle at 30% 25%, var(--gold), var(--gold-deep))',
        boxShadow: '0 0 30px rgba(242,193,78,0.35)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 50% 35%, #2a2f3a 0%, #05070c 80%)',
        }}
      >
        <img
          src={profilePic}
          alt="Moises Nugal"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Implement `IntroContent.tsx`**

Create `src/book/content/IntroContent.tsx`:
```tsx
import { ProfileMedallion } from './ProfileMedallion'

const CTA: React.CSSProperties = {
  padding: '11px 22px',
  borderRadius: 8,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-block',
}

export function IntroContent() {
  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
      <ProfileMedallion size={170} />
      <div style={{ flex: 1, minWidth: 220 }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(30px, 4vw, 48px)',
            color: 'var(--ink)',
            margin: '0 0 12px',
            lineHeight: 1.05,
          }}
        >
          Hi, I&rsquo;m Moi.
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--ink-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
          Computer Engineering student building systems that earn their keep.
        </p>
        <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: 'var(--ink-muted)', margin: '0 0 22px' }}>
          MongoDB · Express · React · TypeScript · Node.js · Python
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#work" style={{ ...CTA, background: 'var(--gold-deep)', color: '#fff' }}>View work</a>
          <a
            href="/Moises_Nugal_CV_Polished.docx"
            download="Moises_Nugal_CV.docx"
            style={{ ...CTA, background: 'transparent', color: 'var(--ink)', border: '1px solid var(--gold-deep)' }}
          >
            Download CV
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Implement `LedgerContent.tsx`**

Create `src/book/content/LedgerContent.tsx`:
```tsx
import { GitHubCalendar } from 'react-github-calendar'

const inkTheme = {
  light: ['#e5d3a8', '#c9a961', '#b8860b', '#8a6508', '#5c4406'],
  dark: ['#e5d3a8', '#c9a961', '#b8860b', '#8a6508', '#5c4406'],
}

export function LedgerContent() {
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Activity Ledger
      </p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(22px,3vw,34px)', color: 'var(--ink)', margin: '0 0 20px' }}>
        A year of commits.
      </h2>
      <div style={{ color: 'var(--ink-muted)', overflowX: 'auto' }}>
        <GitHubCalendar username="moi-script" colorScheme="light" theme={inkTheme} blockSize={9} blockMargin={3} fontSize={11} showColorLegend={false} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement `StoryContent.tsx`**

Create `src/book/content/StoryContent.tsx`:
```tsx
import { acts } from '../../data/story'

export function StoryContent({ part }: { part: 1 | 2 }) {
  const slice = part === 1 ? acts.slice(0, 2) : acts.slice(2, 4)
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Background {part === 1 ? '· I' : '· II'}
      </p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--ink)', margin: '0 0 20px' }}>
        From C++ to shipping systems.
      </h2>
      {slice.map((act) => (
        <div key={act.id} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--gold-deep)' }}>{act.index}</span>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--ink)', margin: 0 }}>{act.title}</h3>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{act.kicker}</span>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-muted)', margin: 0 }}>{act.body}</p>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Implement `WorkContent.tsx` (scrollable chapter)**

Create `src/book/content/WorkContent.tsx`:
```tsx
import { projects } from '../../data/projects'

export function WorkContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Selected Work
      </p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--ink)', margin: '0 0 14px' }}>
        Things I&rsquo;ve built.
      </h2>
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {projects.map((p) => (
          <div key={p.id} style={{ border: '1px solid var(--parchment-edge)', borderRadius: 10, padding: 14, background: 'rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--ink)', margin: 0 }}>{p.name}</h3>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.year} · {p.subject}</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: '0 0 8px' }}>{p.journey.turning_point}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              {p.tags.slice(0, 6).map((t) => (
                <span key={t} style={{ fontFamily: "'Fira Code', monospace", fontSize: 10, color: 'var(--gold-deep)' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>GitHub ↗</a>
              {p.liveDemo && <a href={p.liveDemo} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--gold-deep)' }}>Live ↗</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Implement `AboutContent.tsx`**

Create `src/book/content/AboutContent.tsx`:
```tsx
const modules = [
  { label: 'The Architect', icon: '⬡', desc: 'I design scalable full-stack systems, thinking about how data flows from a MongoDB schema to a React frontend before writing a single line of UI.' },
  { label: 'The Logic', icon: '⌘', desc: '2+ years of breaking and fixing things. My foundation is Node.js and Express, built through real DSA-driven projects rather than tutorials.' },
  { label: 'The Solver', icon: '◈', desc: 'I build to remove friction. Whether it’s OCR reading receipts or an AI assistant, the goal is to make technology work for the person using it.' },
]

export function AboutContent() {
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>About</p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--ink)', margin: '0 0 14px' }}>Architecting Logic. Solving Systems.</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink-muted)', margin: '0 0 18px' }}>
        Computer Engineering student at National College of Science and Technology. I approach software the way an engineer approaches a system — schema-first, with an interest in AI-driven automation.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {modules.map((m) => (
          <div key={m.label} style={{ flex: 1, minWidth: 150, border: '1px solid var(--parchment-edge)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{m.icon}</div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--gold-deep)', margin: '0 0 6px' }}>{m.label}</h4>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.5, color: 'var(--ink-muted)', margin: 0 }}>{m.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2f8f4e' }} />
        Open to internships &amp; freelance
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Implement `ContactContent.tsx`**

Create `src/book/content/ContactContent.tsx`:
```tsx
const links = [
  { label: 'nugalmoises62@gmail.com', href: 'mailto:nugalmoises62@gmail.com' },
  { label: 'github.com/moi-script', href: 'https://github.com/moi-script' },
  { label: 'linkedin.com/in/moises-nugal', href: 'https://www.linkedin.com/in/moises-nugal-1b06833b1' },
]

export function ContactContent() {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>Contact</p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(24px,3.5vw,40px)', color: 'var(--ink)', margin: '0 0 12px' }}>Got a system to build?</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: 'var(--ink-muted)', margin: '0 auto 24px', maxWidth: 380 }}>
        Open to internships, freelance projects, and anything that needs a fresh engineer&rsquo;s perspective.
      </p>
      <a href="mailto:nugalmoises62@gmail.com?subject=Let's%20build%20something" style={{ display: 'inline-block', padding: '12px 26px', marginBottom: 22, background: 'var(--gold-deep)', color: '#fff', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Hire Me</a>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {links.map((l) => (
          <a key={l.label} href={l.href} style={{ padding: '10px 18px', border: '1px solid var(--parchment-edge)', borderRadius: 10, color: 'var(--ink-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: 12, textDecoration: 'none' }}>{l.label}</a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds (components unused so far — fine), lint clean.

- [ ] **Step 9: Commit**

```bash
git add src/book/content
git commit -m "feat: add mode-neutral parchment content components

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 11: Page definitions mapping spreads to content

**Files:**
- Create: `src/book/pages.tsx`

**Interfaces:**
- Consumes: content components (Task 10), `SPREADS`/`SectionId` (Task 4).
- Produces: `PAGES: PageDef[]` where `type PageDef = { section: SectionId; render: () => ReactNode | null }`, one entry per `SPREADS` index in the same order. `cover` and `back` render `null` (chrome-only). Used by `<Page>` `<Html>` in Task 12 and by `FallbackBook` in Task 15.

- [ ] **Step 1: Implement `pages.tsx`**

Create `src/book/pages.tsx`:
```tsx
import type { ReactNode } from 'react'
import type { SectionId } from './navMap'
import { SPREADS } from './navMap'
import { IntroContent } from './content/IntroContent'
import { LedgerContent } from './content/LedgerContent'
import { StoryContent } from './content/StoryContent'
import { WorkContent } from './content/WorkContent'
import { AboutContent } from './content/AboutContent'
import { ContactContent } from './content/ContactContent'

export interface PageDef {
  section: SectionId
  render: () => ReactNode | null
}

// One renderer per SPREADS index, in order. The two 'story' spreads differ by part.
let storyPart = 0
export const PAGES: PageDef[] = SPREADS.map((section): PageDef => {
  switch (section) {
    case 'intro':
      return { section, render: () => <IntroContent /> }
    case 'ledger':
      return { section, render: () => <LedgerContent /> }
    case 'story': {
      storyPart += 1
      const part = storyPart as 1 | 2
      return { section, render: () => <StoryContent part={part} /> }
    }
    case 'work':
      return { section, render: () => <WorkContent /> }
    case 'about':
      return { section, render: () => <AboutContent /> }
    case 'contact':
      return { section, render: () => <ContactContent /> }
    default: // cover, back
      return { section, render: () => null }
  }
})
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 3: Commit**

```bash
git add src/book/pages.tsx
git commit -m "feat: map spreads to content renderers

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 12: Interactive content on the settled spread (hybrid)

**Files:**
- Modify: `src/book/Page.tsx`
- Modify: `src/book/Book.tsx`

**Interfaces:**
- Consumes: `PAGES` (Task 11), drei `<Html>`, `easeSettle`.
- Produces: `<Page>` gains props `content?: () => ReactNode | null` and `isResting: boolean`. When `isResting` is true and `content` is provided, the page renders that content as real DOM via drei `<Html transform>` sized to the page; otherwise only the textured mesh shows. `<Book>` decides, for the current settled spread, which page shows content.

- [ ] **Step 1: Update `Page.tsx` to mount `<Html>` when resting**

Replace `src/book/Page.tsx` with:
```tsx
import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Mesh, ShaderMaterial } from 'three'
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_SEGMENTS,
  makePageMaterial,
} from './pageShader'
import { makeParchmentTexture } from './parchment'

const HTML_SCALE = 0.0072 // world units per CSS px, tuned so content fills a page

export function Page({
  turn,
  z = 0,
  content,
  isResting = false,
}: {
  turn: number
  z?: number
  content?: () => ReactNode | null
  isResting?: boolean
}) {
  const meshRef = useRef<Mesh>(null)
  const material = useMemo(() => makePageMaterial(makeParchmentTexture()), [])

  useFrame(() => {
    const m = meshRef.current?.material as ShaderMaterial | undefined
    if (m) m.uniforms.uTurn.value = turn
  })

  const node = isResting && content ? content() : null

  return (
    <mesh ref={meshRef} position={[0, 0, z]} material={material}>
      <planeGeometry
        args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_SEGMENTS, 1]}
        onUpdate={(g) => g.translate(PAGE_WIDTH / 2, 0, 0)}
      />
      {node && (
        <Html
          transform
          position={[PAGE_WIDTH / 2, 0, 0.02]}
          scale={HTML_SCALE}
          distanceFactor={undefined}
          occlude={false}
          style={{
            width: PAGE_WIDTH / HTML_SCALE - 80,
            height: PAGE_HEIGHT / HTML_SCALE - 80,
            padding: 40,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {node}
        </Html>
      )}
    </mesh>
  )
}
```

- [ ] **Step 2: Update `Book.tsx` to pass content + resting flag**

Replace `src/book/Book.tsx` with:
```tsx
import { Page } from './Page'
import { BookChrome } from './BookChrome'
import { pageProgressToTurn, nearestSpread } from './pageMath'
import { SPREADS } from './navMap'
import { PAGES } from './pages'

const Z_STEP = 0.01

export function Book({ progress }: { progress: number }) {
  const settled = nearestSpread(progress)
  const isSettled = Math.abs(progress - settled) < 0.02

  return (
    <group>
      <BookChrome />
      {SPREADS.map((_, i) => {
        const turn = pageProgressToTurn(progress, i)
        const z = (turn > 0.5 ? i : SPREADS.length - i) * Z_STEP
        // The content for spread `settled` lives on the page that reveals it.
        const showsContent = isSettled && i === settled
        return (
          <Page
            key={i}
            turn={turn}
            z={z}
            isResting={showsContent}
            content={PAGES[i]?.render}
          />
        )
      })}
    </group>
  )
}
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`. Verify:
- When you stop scrolling on a spread, real content appears on the page (intro with circular photo medallion, story acts, work cards, etc.) as crisp DOM.
- Links are clickable; the Work spread’s list scrolls internally; the GitHub calendar renders.
- While actively turning a page, the content hides and the parchment texture bends.
- Content is reasonably centered/sized on the page (adjust `HTML_SCALE` if it overflows — record the final value).

- [ ] **Step 5: Commit**

```bash
git add src/book/Page.tsx src/book/Book.tsx
git commit -m "feat: show interactive content on settled spreads (hybrid)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 13: Nav overlay with section → page jumps

**Files:**
- Create: `src/book/NavOverlay.tsx`
- Modify: `src/book/BookCanvas.tsx`

**Interfaces:**
- Consumes: `pageForSection`, `SPREADS`, `ThemeToggle`, `useReducedMotion` (framer-motion, optional).
- Produces: `<NavOverlay onJump={(section) => void} />` — fixed top bar (logo, links Intro/Story/Work/About/Contact, theme toggle, Hire Me). Clicking a link calls `onJump(section)`. `BookCanvas` implements `onJump` by scrolling to the target page’s scroll offset (`pageIndex / PAGE_COUNT * maxScroll`).

- [ ] **Step 1: Implement `NavOverlay.tsx`**

Create `src/book/NavOverlay.tsx`:
```tsx
import { ThemeToggle } from '../components/ThemeToggle'
import type { SectionId } from './navMap'

const LINKS: { label: string; section: SectionId }[] = [
  { label: 'Intro', section: 'intro' },
  { label: 'Story', section: 'story' },
  { label: 'Work', section: 'work' },
  { label: 'About', section: 'about' },
  { label: 'Contact', section: 'contact' },
]

export function NavOverlay({ onJump }: { onJump: (section: SectionId) => void }) {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', color: 'var(--gold)',
      }}
    >
      <button
        onClick={() => onJump('intro')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}
      >
        Moises Nugal
      </button>
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        {LINKS.map((l) => (
          <button
            key={l.section}
            onClick={() => onJump(l.section)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', color: 'var(--parchment)' }}
          >
            {l.label}
          </button>
        ))}
        <ThemeToggle />
        <button
          onClick={() => onJump('contact')}
          style={{ padding: '7px 16px', border: '1px solid var(--gold)', borderRadius: 6, background: 'transparent', color: 'var(--gold)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.08em' }}
        >
          Hire Me
        </button>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Wire `onJump` in `BookCanvas.tsx`**

In `src/book/BookCanvas.tsx`:
- Add imports: `import { NavOverlay } from './NavOverlay'` and `import { pageForSection, type SectionId } from './navMap'`.
- Add a jump handler inside the component:
```tsx
  const jumpTo = (section: SectionId) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const target = (pageForSection(section) / PAGE_COUNT) * max
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
```
- Render `<NavOverlay onJump={jumpTo} />` just before the spacer `<div>`.

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`. Verify the nav sits over the book; clicking each link smooth-scrolls so the book turns to that spread and settles, revealing that section’s content. Theme toggle still works. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/book/NavOverlay.tsx src/book/BookCanvas.tsx
git commit -m "feat: add nav overlay that turns the book to a section

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 14: Cover and back-cover content

**Files:**
- Modify: `src/book/BookChrome.tsx`
- Modify: `src/book/Book.tsx`

**Interfaces:**
- Consumes: drei `<Html>` (or `<Text>`), `PAGE_HEIGHT`.
- Produces: an embossed title on the closed cover ("Moi — The Codex", "scroll to open") shown only when `progress < 0.5`, and a short back-cover credit shown when `progress > SPREADS.length - 1.5`. Simplest implementation: a `<CoverText visible progress={progress} />` sub-component in `BookChrome` using drei `<Text>` so it needs no HTML scaling.

- [ ] **Step 1: Add cover/back text to `BookChrome.tsx`**

Add `import { Text } from '@react-three/drei'` at the top, add a `progress` prop to `BookChrome`, and render before the closing `</group>`:
```tsx
      {progress < 0.5 && (
        <group position={[0, 0, 0.2]}>
          <Text position={[0, 0.6, 0]} fontSize={0.5} color="#f2c14e" anchorX="center" anchorY="middle" font={undefined}>
            The Codex
          </Text>
          <Text position={[0, -0.2, 0]} fontSize={0.22} color="#e9d6ad" anchorX="center" anchorY="middle">
            Moises Nugal · Portfolio
          </Text>
          <Text position={[0, -1.4, 0]} fontSize={0.14} color="#cdb488" anchorX="center" anchorY="middle">
            scroll to open ↓
          </Text>
        </group>
      )}
      {progress > 6.5 && (
        <group position={[0, 0, 0.2]}>
          <Text position={[0, 0, 0]} fontSize={0.2} color="#e9d6ad" anchorX="center" anchorY="middle">
            Thanks for reading.
          </Text>
        </group>
      )}
```
Update the signature to `export function BookChrome({ progress }: { progress: number })`.

- [ ] **Step 2: Pass `progress` from `Book.tsx`**

In `src/book/Book.tsx`, change `<BookChrome />` to `<BookChrome progress={progress} />`.

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean. (drei `<Text>` uses troika; if the build complains about a missing font, the default font is fetched at runtime — acceptable; if offline builds fail, note it. It should build fine.)

- [ ] **Step 4: Manual browser verification**

Run: `npm run dev`. At the very top, the closed book shows "The Codex / Moises Nugal · Portfolio / scroll to open". Scrolling past the last spread shows "Thanks for reading." No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/book/BookChrome.tsx src/book/Book.tsx
git commit -m "feat: add cover title and back-cover credit

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 15: Fallback book — parchment cards

**Files:**
- Create: `src/book/ParchmentCard.tsx`
- Create: `src/book/FallbackBook.tsx`

**Interfaces:**
- Consumes: `PAGES` (Task 11), `NavOverlay` (Task 13).
- Produces:
  - `<ParchmentCard children />` — a warm parchment-styled surface (rounded, gold border, subtle shadow) centered with max-width.
  - `<FallbackBook />` — stacked vertical `ParchmentCard`s, one per content-bearing spread (skips `cover`/`back` `null` renders). Includes `<NavOverlay>` whose `onJump` scrolls to the matching card via `id`.

- [ ] **Step 1: Implement `ParchmentCard.tsx`**

Create `src/book/ParchmentCard.tsx`:
```tsx
import type { ReactNode } from 'react'

export function ParchmentCard({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div
      id={id}
      style={{
        maxWidth: 760,
        margin: '0 auto 28px',
        padding: 32,
        borderRadius: 16,
        background: 'var(--parchment)',
        border: '2px solid var(--gold-deep)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
        scrollMarginTop: 80,
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Implement `FallbackBook.tsx`**

Create `src/book/FallbackBook.tsx`:
```tsx
import { ParchmentCard } from './ParchmentCard'
import { NavOverlay } from './NavOverlay'
import { PAGES } from './pages'
import { pageForSection, type SectionId } from './navMap'

export function FallbackBook() {
  const jumpTo = (section: SectionId) => {
    document.getElementById(`spread-${pageForSection(section)}`)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div style={{ minHeight: '100vh', background: 'var(--room-bg)', padding: '88px 16px 60px' }}>
      <NavOverlay onJump={jumpTo} />
      {PAGES.map((p, i) => {
        const node = p.render()
        if (!node) return null
        return (
          <ParchmentCard key={i} id={`spread-${i}`}>
            {node}
          </ParchmentCard>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, lint clean.

- [ ] **Step 4: Commit**

```bash
git add src/book/ParchmentCard.tsx src/book/FallbackBook.tsx
git commit -m "feat: add parchment-card fallback book

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 16: Wire mode switch into App + lazy-load the canvas

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useBookMode` (Task 3), `FallbackBook` (Task 15), `BookCanvas` (lazy).
- Produces: final `App` that renders `<BookCanvas>` for `'webgl'` mode and `<FallbackBook>` for `'cards'` mode. `BookCanvas` is `React.lazy` so three.js is code-split and never downloaded in cards mode.

- [ ] **Step 1: Rewrite `App.tsx`**

Replace `src/App.tsx` with:
```tsx
import { Suspense, lazy } from 'react'
import { useBookMode } from './book/useBookMode'
import { FallbackBook } from './book/FallbackBook'

const BookCanvas = lazy(() =>
  import('./book/BookCanvas').then((m) => ({ default: m.BookCanvas })),
)

export default function App() {
  const mode = useBookMode()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--room-bg)', overflowX: 'hidden' }}>
      {mode === 'webgl' ? (
        <Suspense fallback={<div style={{ height: '100vh' }} />}>
          <BookCanvas />
        </Suspense>
      ) : (
        <FallbackBook />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds; build output shows a separate chunk for the three.js/BookCanvas code (code-split). Lint clean.

- [ ] **Step 3: Manual browser verification**

Run: `npm run dev`. Verify:
- Wide window: the 3D book renders.
- Narrow the window below 820px (or use devtools device mode): the page switches to stacked parchment cards; nav jumps scroll to the right card; no WebGL canvas mounts.
- Toggle OS "reduce motion" (or emulate in devtools Rendering → prefers-reduced-motion): cards render even when wide.
- No console errors in either mode.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: switch between 3D book and parchment-card fallback

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 17: Settle animation, polish, and cleanup

**Files:**
- Modify: `src/book/BookCanvas.tsx`
- Delete: `src/sections/*` and `src/components/Nav.tsx` (superseded), if unreferenced
- Modify: `src/main.tsx` (only if it referenced removed files)

**Interfaces:**
- Consumes: `easeSettle`, `nearestSpread`.
- Produces: smooth settle — when the user stops scrolling near a spread, `progress` eases to the nearest integer so a page never rests mid-turn. Also removes now-dead legacy files.

- [ ] **Step 1: Add settle easing to `BookCanvas.tsx`**

In `src/book/BookCanvas.tsx`, add a rAF settle loop that nudges the *rendered* progress toward the nearest spread shortly after scrolling stops. Replace the scroll effect body with:
```tsx
  const [progress, setProgress] = useState(0)
  const rawRef = useRef(0)
  const idleTimer = useRef<number | null>(null)

  useEffect(() => {
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? (window.scrollY / max) * PAGE_COUNT : 0
    }
    const onScroll = () => {
      rawRef.current = readScroll()
      setProgress(rawRef.current)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(settle, 140)
    }
    const settle = () => {
      const target = nearestSpread(rawRef.current)
      const step = () => {
        const cur = rawRef.current
        const next = cur + (target - cur) * 0.2
        rawRef.current = next
        setProgress(next)
        if (Math.abs(target - next) > 0.001) requestAnimationFrame(step)
        else { rawRef.current = target; setProgress(target) }
      }
      requestAnimationFrame(step)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [])
```
Add `import { nearestSpread } from './pageMath'` (keep existing imports). Remove the now-unused `scrollRef`/`easeSettle` if present. Note: `settle` snaps to the nearest spread — for a design that allows holding a page mid-turn while actively scrolling, this only runs after a 140ms idle, preserving the continuous-scrub feel during active scroll.

- [ ] **Step 2: Remove superseded legacy files**

Confirm nothing imports them:
```bash
grep -rn "sections/\|components/Nav" src/App.tsx src/main.tsx
```
Expected: no matches (App no longer imports them). Then delete:
```bash
git rm src/sections/Hero.tsx src/sections/Story.tsx src/sections/Work.tsx \
       src/sections/About.tsx src/sections/Contact.tsx src/sections/Footer.tsx \
       src/sections/ProjectScene.tsx src/components/Nav.tsx
```
(Keep `src/components/Reveal.tsx`, `ThemeToggle.tsx`, `src/theme/*`, `src/data/*`.)

- [ ] **Step 3: Verify build + lint + tests**

Run: `npm run build && npm run lint && npm run test`
Expected: build succeeds, lint clean, all unit tests pass. Fix any dangling imports the deletion exposed.

- [ ] **Step 4: Full manual verification pass**

Run: `npm run dev`. Verify end-to-end:
- Cover → scroll → intro (photo medallion) → ledger (calendar) → story ×2 → work (scrolls) → about → contact → back cover.
- Pages settle cleanly to a flat spread when scrolling stops.
- Nav jumps work; links/CV/calendar work on resting spreads.
- Resize < 820px and reduced-motion → fallback cards, all content present.
- No console errors; smooth on desktop.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: settle pages to nearest spread and remove legacy sections

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Whole-site book → Tasks 7–9, 12, 14 (all spreads). ✓
- Cartoon fantasy look (parchment/wood/gold) → Tasks 1 (tokens), 5 (parchment), 6 (bend), 9 (chrome). ✓
- WebGL (three/r3f/drei) → Task 1 deps, Tasks 6–9. ✓
- Hybrid interactive content → Task 12 (`<Html>` on resting spread only). ✓
- Circular profile medallion on intro → Task 10 (`ProfileMedallion`, used in `IntroContent`). ✓
- Continuous scrub + settle → Tasks 7 (scrub), 17 (settle after idle). ✓
- Work as scrollable chapter → Task 10 (`WorkContent` internal `overflowY`). ✓
- Candlelit room backdrop (vignette + dust) → Task 7 (`Backdrop`). ✓
- Mobile/reduced-motion parchment-card fallback → Tasks 3, 15, 16. ✓
- Reuse existing data → Tasks 10–11 import `data/*` unchanged. ✓
- Nav section→page mapping → Tasks 4, 13. ✓
- Phased build order (scene → multipage → content+nav → fallback+polish) → Tasks 7 / 8–9 / 10–14 / 15–17. ✓

**Placeholder scan:** No TBD/TODO; every code step contains full code. Texture-sourcing decision from the spec ("deferred to plan") is resolved: procedural parchment (Task 5) + geometry chrome (Task 9), not the reference JPG.

**Type consistency:** `pageProgressToTurn(progress, i)`, `nearestSpread`, `SPREADS`, `pageForSection`, `SectionId`, `PageDef`, `makePageMaterial(map)`, `makeParchmentTexture()`, `BookMode`, `resolveBookMode` are used with identical signatures across tasks. `<Page>` props (`turn`, `z`, `content`, `isResting`) match between Tasks 7/12 and its callers in `Book`.

**Known tuning risks (flagged for the implementer, not blockers):** `HTML_SCALE` (Task 12) and camera framing (Task 7) are visual constants to adjust in-browser; the manual steps call this out. drei `<Text>` default font is fetched at runtime (Task 14).
