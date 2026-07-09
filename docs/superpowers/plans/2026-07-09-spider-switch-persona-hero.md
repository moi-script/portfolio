# Spider-Switch Two-Persona Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's static portrait with an interactive physics-based spider pull-switch and a two-persona (day/night) scene that morphs when the spider toggles the site's existing light/dark theme.

**Architecture:** The spider calls the existing `useTheme().toggle()`, so `light` = Day persona and `dark` = Night persona and every other section follows automatically. A new `SpiderSwitch` component owns the pull physics; a new `PersonaScene` component renders the morphing day/night workspace vignette around the portrait; `Hero` is rewritten to compose them. All animation is transform/opacity-based via `framer-motion` (already installed).

**Tech Stack:** React 19, TypeScript, framer-motion 12, Vite, Vitest/jsdom. Inline styles + CSS custom properties (NO Tailwind).

## Global Constraints

- No new global theme state. The spider toggles theme via `useTheme()` from `src/theme/ThemeContext.tsx` (`toggle()`, `theme: 'light' | 'dark'`).
- `light` = Day persona, `dark` = Night persona.
- Personas build on the existing coffee tokens (`var(--bg-elev)`, `var(--fg)`, `var(--accent)`, etc.); persona accents (cool day / RGB night) are layered only inside the hero.
- Keep the nav's existing `ThemeToggle` untouched (always-reachable fallback).
- Reuse the portrait `src/assets/profile_pic_portfolio.png`.
- All motion respects `prefers-reduced-motion` via framer's `useReducedMotion()`.
- Animate only `transform`, `opacity`, `filter` on decorative layers — never layout properties (`width`/`height`/`top`/`box-shadow` on large layers) — to hold 60fps.
- Decorative spider/web/scene/particle elements are `aria-hidden`; the spider control itself is a focusable `<button>` with an `aria-label`.
- Left hero content and its copy are unchanged from the current `Hero.tsx`.
- `npm run build` and `npm run lint` must pass at the end of every task; existing tests stay green.

---

### Task 1: Pull-decision helper (pure, TDD)

**Files:**
- Create: `src/lib/pullSwitch.ts`
- Test: `src/lib/pullSwitch.test.ts`

**Interfaces:**
- Produces: `export const VELOCITY_TRIGGER = 800` and
  `export function shouldToggle(pullDistance: number, velocity: number, threshold: number): boolean`.
  Returns true when the spider was pulled far enough (`pullDistance >= threshold`) OR flicked
  fast enough downward (`velocity >= VELOCITY_TRIGGER`). Consumed by `SpiderSwitch` (Task 2).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { shouldToggle, VELOCITY_TRIGGER } from './pullSwitch'

describe('shouldToggle', () => {
  it('is false for a small slow pull', () => {
    expect(shouldToggle(40, 100, 60)).toBe(false)
  })
  it('is true exactly at the distance threshold', () => {
    expect(shouldToggle(60, 0, 60)).toBe(true)
  })
  it('is true well past the threshold', () => {
    expect(shouldToggle(120, 0, 60)).toBe(true)
  })
  it('is true for a fast flick even below the distance threshold', () => {
    expect(shouldToggle(20, VELOCITY_TRIGGER, 60)).toBe(true)
  })
  it('is false for a slow pull just under threshold and low velocity', () => {
    expect(shouldToggle(59, VELOCITY_TRIGGER - 1, 60)).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/pullSwitch.test.ts`
Expected: FAIL — cannot resolve `./pullSwitch`.

- [ ] **Step 3: Create `src/lib/pullSwitch.ts`**

```ts
/** Downward drag velocity (px/s) that counts as a deliberate flick even on a short pull. */
export const VELOCITY_TRIGGER = 800

/** Decide whether a spider pull should toggle the theme. */
export function shouldToggle(pullDistance: number, velocity: number, threshold: number): boolean {
  return pullDistance >= threshold || velocity >= VELOCITY_TRIGGER
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/pullSwitch.test.ts`
Expected: PASS (5 cases).

- [ ] **Step 5: Commit**

```bash
git add src/lib/pullSwitch.ts src/lib/pullSwitch.test.ts
git commit -m "feat: add spider pull-decision helper"
```

---

### Task 2: SpiderSwitch component

**Files:**
- Create: `src/components/SpiderSwitch.tsx`
- Modify: `src/index.css` (append spider styles)

**Interfaces:**
- Consumes: `shouldToggle`, `VELOCITY_TRIGGER` (Task 1).
- Produces: `export function SpiderSwitch({ onToggle, isNight }: { onToggle: () => void; isNight: boolean }): JSX.Element`.
  `onToggle` is `toggle` from `useTheme()`; `isNight` drives `aria-pressed` and the label. Positioned by its parent (Task 4).

- [ ] **Step 1: Create `src/components/SpiderSwitch.tsx`**

```tsx
import { useRef } from 'react'
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { shouldToggle } from '../lib/pullSwitch'

const REST_LEN = 64        // resting web length (px)
const MAX_PULL = 120       // furthest the spider can be pulled
const PULL_THRESHOLD = 60  // pull distance that counts as a real switch
const SNAP = { type: 'spring' as const, stiffness: 260, damping: 11 }

function SpiderGlyph() {
  // Body + head + 8 legs + eyes. Uses currentColor so it stays visible in both themes.
  return (
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M23 22 C14 18 10 24 6 22" />
        <path d="M23 24 C13 24 9 30 5 30" />
        <path d="M23 26 C14 30 11 35 7 37" />
        <path d="M23 22 C15 20 12 16 9 15" />
        <path d="M23 22 C32 18 36 24 40 22" />
        <path d="M23 24 C33 24 37 30 41 30" />
        <path d="M23 26 C32 30 35 35 39 37" />
        <path d="M23 22 C31 20 34 16 37 15" />
      </g>
      <ellipse cx="23" cy="25" rx="8" ry="9" fill="currentColor" />
      <circle cx="23" cy="15" r="5.5" fill="currentColor" />
      <circle cx="21" cy="14" r="1.1" fill="var(--accent)" />
      <circle cx="25" cy="14" r="1.1" fill="var(--accent)" />
    </svg>
  )
}

export function SpiderSwitch({ onToggle, isNight }: { onToggle: () => void; isNight: boolean }) {
  const reduce = useReducedMotion()
  const y = useMotionValue(0)
  const webScaleY = useTransform(y, (v) => (REST_LEN + Math.max(0, v)) / REST_LEN)
  const moved = useRef(false)

  const label = isNight
    ? 'Pull the spider to switch to day'
    : 'Pull the spider to switch to night'

  // Scripted pull for click / keyboard (and the whole interaction when reduced motion is on).
  const scriptedPull = async () => {
    if (reduce) {
      onToggle()
      return
    }
    await animate(y, MAX_PULL * 0.75, { duration: 0.16, ease: 'easeIn' }).finished
    onToggle()
    animate(y, 0, SNAP)
  }

  return (
    <div className="spider-switch" aria-hidden={false}>
      {/* pendulum wrapper: gentle idle sway around the top anchor */}
      <motion.div
        className="spider-pendulum"
        style={{ transformOrigin: 'top center' }}
        animate={reduce ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
        transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div className="spider-web" aria-hidden style={{ scaleY: webScaleY, transformOrigin: 'top' }} />
        <motion.button
          type="button"
          className="spider-body"
          aria-label={label}
          aria-pressed={isNight}
          style={{ y }}
          drag={reduce ? false : 'y'}
          dragConstraints={{ top: 0, bottom: MAX_PULL }}
          dragElastic={0.35}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          onPointerDown={() => { moved.current = false }}
          onDrag={(_e, info) => { if (Math.abs(info.offset.y) > 4) moved.current = true }}
          onDragEnd={(_e, info) => {
            const dist = Math.max(0, info.offset.y)
            if (shouldToggle(dist, info.velocity.y, PULL_THRESHOLD)) onToggle()
            animate(y, 0, SNAP)
          }}
          onClick={() => { if (!moved.current) void scriptedPull() }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              void scriptedPull()
            }
          }}
        >
          <motion.span
            className="spider-glyph"
            animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
            transition={reduce ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SpiderGlyph />
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Append spider styles to `src/index.css`**

```css
/* Spider pull-switch */
.spider-switch {
  width: 60px;
  display: flex;
  justify-content: center;
  color: var(--fg);
  pointer-events: none; /* only the button is interactive */
}
.spider-pendulum {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.spider-web {
  width: 2px;
  height: 64px; /* REST_LEN */
  background: linear-gradient(var(--fg-faint), var(--fg-muted));
  opacity: 0.5;
}
.spider-body {
  margin-top: -6px;
  padding: 6px;
  background: none;
  border: none;
  cursor: grab;
  color: inherit;
  pointer-events: auto;
  touch-action: none; /* let framer own vertical drag */
  border-radius: 12px;
  display: flex;
}
.spider-body:active { cursor: grabbing; }
.spider-body:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.spider-glyph { display: flex; line-height: 0; }
```

- [ ] **Step 3: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS. (Component is unused until Task 4 — it only needs to compile.)

- [ ] **Step 4: Commit**

```bash
git add src/components/SpiderSwitch.tsx src/index.css
git commit -m "feat: add interactive spider pull-switch"
```

---

### Task 3: PersonaScene component

**Files:**
- Create: `src/sections/PersonaScene.tsx`
- Modify: `src/index.css` (append persona scene styles)

**Interfaces:**
- Consumes: `useTheme()` (existing), portrait asset.
- Produces: `export function PersonaScene(): JSX.Element` — the hero's right column: portrait +
  cross-fading day/night vignette. Reads `theme` internally; no props.

- [ ] **Step 1: Create `src/sections/PersonaScene.tsx`**

```tsx
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '../theme/ThemeContext'
import portrait from '../assets/profile_pic_portfolio.png'

const DAY_FILTER = 'grayscale(0.15) sepia(0.28) saturate(1.2) brightness(1.06) contrast(1.02) hue-rotate(-6deg)'
const NIGHT_FILTER = 'grayscale(0.45) sepia(0.6) saturate(1.4) brightness(0.82) contrast(1.06) hue-rotate(-14deg)'

function DayScene() {
  return (
    <div className="scene day-scene" aria-hidden>
      <div className="day-wash" />
      <div className="prop day-laptop" />
      <div className="prop day-mug" />
      <div className="prop day-plant" />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="mote"
          style={{ left: `${12 + i * 18}%`, top: `${20 + (i % 3) * 22}%` }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
    </div>
  )
}

function NightScene() {
  return (
    <div className="scene night-scene" aria-hidden>
      <div className="night-wash" />
      <div className="night-extra">
        <div className="monitor m-left" />
        <div className="monitor m-center" />
        <div className="monitor m-right" />
        <div className="rgb-underglow" />
      </div>
      <div className="scanlines" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className="spark"
          style={{ left: `${8 + i * 15}%`, top: `${15 + (i % 4) * 20}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
    </div>
  )
}

export function PersonaScene() {
  const { theme } = useTheme()
  const reduce = useReducedMotion()
  const night = theme === 'dark'

  return (
    <div className="persona-scene hero-photo">
      <img
        className="hero-photo-img"
        src={portrait}
        alt="John Moises"
        style={{ filter: night ? NIGHT_FILTER : DAY_FILTER, transition: 'filter 0.6s ease' }}
      />
      {night && <div className="rgb-rim" aria-hidden />}
      {/* No mode="wait": old and new scenes overlap so they cross-fade (dissolve) rather than blanking between. */}
      <AnimatePresence>
        <motion.div
          key={theme}
          className="scene-layer"
          aria-hidden
          initial={reduce ? false : { opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {night ? <NightScene /> : <DayScene />}
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="hero-photo-fade" style={{ position: 'absolute', inset: 0 }} />
    </div>
  )
}
```

- [ ] **Step 2: Append persona scene styles to `src/index.css`**

```css
/* Persona scene (hero right side) */
.persona-scene { position: relative; align-self: stretch; min-height: 420px; overflow: hidden; }
.scene-layer { position: absolute; inset: 0; pointer-events: none; }
.scene { position: absolute; inset: 0; }

/* Day */
.day-wash {
  position: absolute; inset: 0;
  background: radial-gradient(120% 90% at 70% 15%, rgba(120,170,220,0.20), transparent 55%),
              linear-gradient(180deg, rgba(255,250,243,0.10), transparent 40%);
}
.prop { position: absolute; border-radius: 6px; }
.day-laptop {
  right: 10%; bottom: 14%; width: 92px; height: 58px;
  background: linear-gradient(160deg, rgba(200,210,225,0.55), rgba(150,165,190,0.35));
  box-shadow: 0 10px 24px rgba(60,70,90,0.18);
}
.day-mug {
  right: 30%; bottom: 15%; width: 22px; height: 24px; border-radius: 4px 4px 8px 8px;
  background: rgba(200,135,79,0.5);
}
.day-plant {
  left: 12%; bottom: 12%; width: 26px; height: 40px; border-radius: 40% 40% 6px 6px;
  background: linear-gradient(180deg, rgba(90,150,110,0.6), rgba(60,110,80,0.4));
}
.mote { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: rgba(150,190,230,0.7); }

/* Night */
.night-wash {
  position: absolute; inset: 0;
  background: radial-gradient(120% 90% at 65% 20%, rgba(0,200,255,0.14), transparent 55%),
              radial-gradient(100% 80% at 30% 80%, rgba(255,60,180,0.12), transparent 55%),
              linear-gradient(180deg, rgba(10,7,4,0.35), rgba(10,7,4,0.6));
}
.night-extra { position: absolute; inset: 0; }
.monitor {
  position: absolute; bottom: 20%; height: 46px; border-radius: 4px;
  background: rgba(10,20,30,0.85); border: 1px solid rgba(0,220,255,0.5);
  box-shadow: 0 0 16px rgba(0,200,255,0.35);
}
.m-left { left: 8%; width: 60px; transform: perspective(300px) rotateY(18deg); }
.m-center { left: 38%; width: 70px; height: 52px; box-shadow: 0 0 18px rgba(0,220,255,0.5); }
.m-right { right: 8%; width: 60px; transform: perspective(300px) rotateY(-18deg); }
.rgb-underglow {
  position: absolute; left: 6%; right: 6%; bottom: 16%; height: 8px; border-radius: 999px; filter: blur(6px);
  background: linear-gradient(90deg, rgba(0,220,255,0.7), rgba(160,80,255,0.7), rgba(255,60,180,0.7));
}
.scanlines {
  position: absolute; inset: 0; opacity: 0.10; pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 3px);
}
.spark { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: rgba(0,220,255,0.9); }
.rgb-rim {
  position: absolute; inset: 0; pointer-events: none;
  box-shadow: inset -40px 0 60px -30px rgba(0,220,255,0.5), inset 40px 0 60px -30px rgba(255,60,180,0.45);
}

@media (max-width: 860px) {
  /* .persona-scene also carries the .hero-photo class, so its existing !important
     min-height/order/object-position rules still apply; only simplify the night clutter here. */
  .night-extra { display: none; }
}
```

- [ ] **Step 3: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS. (Unused until Task 4.)

- [ ] **Step 4: Commit**

```bash
git add src/sections/PersonaScene.tsx src/index.css
git commit -m "feat: add morphing day/night persona scene"
```

---

### Task 4: Hero rewrite — compose spider + persona scene

**Files:**
- Modify: `src/sections/Hero.tsx`
- Modify: `src/index.css` (spider positioning inside the hero card + responsive)

**Interfaces:**
- Consumes: `SpiderSwitch` (Task 2), `PersonaScene` (Task 3), `useTheme()` (existing), `Reveal` (existing).

- [ ] **Step 1: Rewrite `src/sections/Hero.tsx`**

Keep the left column and all its copy exactly as-is. Replace the right `.hero-photo` block with
`<PersonaScene />`, add `SpiderSwitch` in the card's top-right, and pass `toggle`/`theme` from `useTheme()`.

```tsx
import type { CSSProperties } from 'react'
import { Reveal } from '../components/Reveal'
import { SpiderSwitch } from '../components/SpiderSwitch'
import { PersonaScene } from './PersonaScene'
import { useTheme } from '../theme/ThemeContext'

const RESUME = '/Moises_Nugal_CV_Polished.docx' // current CV
const GITHUB = 'https://github.com/moi-script'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace
const EMAIL = 'nugalmoises62@gmail.com'

const btnBase: CSSProperties = {
  padding: '13px 26px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
  fontSize: 15, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  display: 'inline-block', transition: 'transform 0.15s, opacity 0.2s',
}

export function Hero() {
  const { theme, toggle } = useTheme()
  const isNight = theme === 'dark'
  return (
    <section id="home" style={{ padding: '48px 24px 24px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', background: 'var(--bg-elev)',
        border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden',
        boxShadow: 'var(--shadow)', position: 'relative',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        alignItems: 'center', gap: 24, transition: 'background 0.6s ease',
      }} className="hero-grid">
        {/* spider pull-switch in the top-right corner */}
        <div className="hero-spider-mount">
          <SpiderSwitch onToggle={toggle} isNight={isNight} />
        </div>
        {/* accent glow */}
        <div aria-hidden style={{
          position: 'absolute', right: '8%', top: '20%', width: 340, height: 340,
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.28, filter: 'blur(30px)', pointerEvents: 'none', transition: 'opacity 0.6s ease',
        }} />
        <div style={{ padding: '56px clamp(24px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <h1 style={{
              margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 900,
              fontSize: 'clamp(34px, 5.5vw, 60px)', lineHeight: 1.05, color: 'var(--fg)',
            }}>Hi, I'm John Moises</h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{
              margin: '10px 0 0', fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: 'clamp(20px, 3vw, 30px)', color: 'var(--accent)',
            }}>Full-Stack Developer</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{
              margin: '20px 0 0', maxWidth: 460, fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, lineHeight: 1.7, color: 'var(--fg-muted)',
            }}>
              Computer Engineering student. I build full-stack apps and wire AI into
              them, like receipt scanning that reads prices off a photo and agents that
              analyze markets.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
              <a href="#projects" style={{ ...btnBase, background: 'var(--accent)', color: '#1a120b' }}>View Projects</a>
              <a href="#contact" style={{ ...btnBase, background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)' }}>Let's Talk</a>
              <a href={RESUME} download style={{ ...btnBase, background: 'transparent', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>Download Resume</a>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div style={{ display: 'flex', gap: 14, marginTop: 34, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
              <a href={GITHUB} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>GitHub</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>LinkedIn</a>
              <a href={`mailto:${EMAIL}`} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Email</a>
            </div>
          </Reveal>
        </div>
        <PersonaScene />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add spider mount positioning + responsive to `src/index.css`**

```css
/* Spider mount inside the hero card */
.hero-spider-mount {
  position: absolute;
  top: 0;
  right: 40px;
  z-index: 5;
}
@media (max-width: 860px) {
  .hero-spider-mount { right: 20px; } /* stays in reach on the stacked card */
}
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — `pullSwitch.test.ts` green plus the existing `skills`, `skillIcons`, `useActiveSection` tests; total 5 test files.

- [ ] **Step 4: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS, no errors.

- [ ] **Step 5: Manual smoke check (browser)**

Run `npm run dev`, open the hero. Verify: the spider hangs top-right and sways; hovering shows a
pointer and a subtle reaction; dragging it down stretches the web and, past ~60px, toggles the
theme on release with a bounce; clicking or focusing + Enter also toggles; the right-side scene
cross-fades between the day workspace and the night cyberpunk vignette; the portrait re-lights per
persona; the nav toggle still works; and everything still works with the OS "reduce motion" setting
on (spider becomes a plain toggle button, no idle sway/particles). Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add src/sections/Hero.tsx src/index.css
git commit -m "feat: compose spider switch and persona scene into hero"
```

---

## Notes for the implementer

- **framer-motion imperative `animate`:** `animate(motionValue, target, options)` returns controls
  with a `.finished` promise — `await animate(...).finished` is used in the scripted pull.
- **Drag vs click double-toggle:** the `moved` ref (set in `onDrag` when the pointer moves >4px)
  guards `onClick` so a drag-release doesn't also fire the scripted click toggle.
- **`touch-action: none`** on `.spider-body` is required so framer's vertical drag works on touch
  without the page scrolling.
- **Reduced motion:** every idle/loop/drag animation is gated on `useReducedMotion()`; when true the
  spider is a static, focusable button whose click/Enter/Space calls `onToggle()` directly, and the
  persona scene cross-fades with opacity only.
- **Colors:** the spider glyph uses `currentColor` (set to `var(--fg)` by `.spider-switch`) so it is
  visible in both themes. Scene accent colors (cyan/magenta/blue) are decorative literals, allowed
  here because they are persona effects layered over the coffee base, not part of the shared token system.
- **Performance:** only `transform`/`opacity`/`filter` are animated. Do not convert the web stretch to
  animate `height`; it must stay `scaleY` on a fixed-height strand.
```
