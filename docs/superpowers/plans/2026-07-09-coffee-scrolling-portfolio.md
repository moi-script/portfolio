# Coffee Scrolling Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3D WebGL "book" portfolio with a conventional, coffee-themed single-page scrolling portfolio for a full-stack + AI developer.

**Architecture:** A single scrolling page composed of section components (Hero, About, Skills, Projects, GitHub, Timeline, Contact) plus a sticky nav and footer. Scroll-reveal via the existing `framer-motion` `Reveal` component; active-nav tracking via an IntersectionObserver hook. Light (latte) + dark (espresso) theme through the existing `ThemeContext` and retuned CSS tokens. Real data from `src/data/*` is reused; the entire `src/book/` tree and `three`/`@react-three/*` are removed.

**Tech Stack:** React 19, TypeScript, Vite 7, framer-motion, react-github-calendar, Vitest + jsdom. Fonts: Syne (display), DM Sans (body), Fira Code (mono).

## Global Constraints

- Display name: **John Moises**. Title: **Full-Stack & AI Developer**.
- GitHub: `https://github.com/moi-script` (username `moi-script`). Email: `nugalmoises62@gmail.com`.
- LinkedIn URL and `resume.pdf` are placeholders — mark clearly with `TODO` so the user can replace them.
- Coffee palette only (no blue). Accent caramel `#c8874f` (dark) / `#a5673a` (light).
- Hero portrait: `src/assets/profile_pic_1.png`, coffee-duotone treated.
- All motion must respect `prefers-reduced-motion` (already handled by `Reveal` and `tokens.css`).
- Theme values written to `data-theme` on `<html>` by the existing `ThemeProvider`; use CSS `var(--*)` tokens, never hardcoded colors in components.
- Section elements MUST use these exact ids (nav + hooks depend on them): `home`, `about`, `skills`, `projects`, `github`, `journey`, `contact`.
- `npm run build` (tsc -b + vite build) and `npm run lint` must pass at the end of every task that changes source.

---

### Task 1: Teardown — remove the book, get a clean blank build

**Files:**
- Delete: entire `src/book/` directory (all `.tsx`, `.ts`, `.test.ts`)
- Modify: `src/App.tsx` (rewrite to a stub)
- Modify: `src/main.tsx` (restore `StrictMode`)
- Modify: `package.json` (remove `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`)
- Modify: `src/index.css` (background color)

**Interfaces:**
- Produces: `App` default export (stub for now, filled in Task 13).

- [ ] **Step 1: Delete the book tree and its imports**

```bash
rm -rf src/book
```

- [ ] **Step 2: Replace `src/App.tsx` with a stub**

```tsx
export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* sections composed in Task 13 */}
    </div>
  )
}
```

- [ ] **Step 3: Restore StrictMode in `src/main.tsx`**

Replace the whole file (the r3f Canvas that forced StrictMode off is gone):

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme/tokens.css'
import { ThemeProvider } from './theme/ThemeContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

- [ ] **Step 4: Remove three-related dependencies**

```bash
npm uninstall three @react-three/fiber @react-three/drei @types/three
```

- [ ] **Step 5: Fix the flash-guard background in `src/index.css`**

```css
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: #0f0a06; /* espresso; prevents white flash before tokens load */
}
```

- [ ] **Step 6: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS, no references to `./book/*`, no unused three imports. If tsc reports leftover imports of book modules, remove them.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove 3D book experience and three deps"
```

---

### Task 2: Coffee palette tokens

**Files:**
- Modify: `src/theme/tokens.css`

**Interfaces:**
- Produces: CSS custom properties `--bg, --bg-elev, --fg, --fg-muted, --fg-faint, --border, --accent, --accent-2, --shadow` for both `[data-theme="light"]` and `[data-theme="dark"]`; keeps `--scrim, --scrim-border, --on-image, --on-image-muted`.

- [ ] **Step 1: Rewrite the palette blocks in `src/theme/tokens.css`**

Keep the `@import` font line at the top. Replace the `:root` light block, the `:root[data-theme="dark"]` block, and DELETE the entire "Book palette" block (`--parchment` … `--room-bg`). Keep the on-image scrim block. Result:

```css
:root, :root[data-theme="light"] {
  --bg: #f5ede1;
  --bg-elev: #fffaf3;
  --fg: #2b1d12;
  --fg-muted: #6b5844;
  --fg-faint: #a3927c;
  --border: rgba(43, 29, 18, 0.10);
  --accent: #a5673a;
  --accent-2: #c8874f;
  --code-bg: #241812;
  --code-fg: #e8d8c4;
  --shadow: 0 20px 60px rgba(43, 29, 18, 0.08);
}

:root[data-theme="dark"] {
  --bg: #0f0a06;
  --bg-elev: #1a120b;
  --fg: #f0e6d8;
  --fg-muted: #b7a790;
  --fg-faint: #7a6b57;
  --border: rgba(240, 230, 216, 0.08);
  --accent: #c8874f;
  --accent-2: #e0a668;
  --code-bg: rgba(0, 0, 0, 0.4);
  --code-fg: #e0a668;
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* On-image tokens — theme-independent (project cards overlay photos). */
:root {
  --scrim: rgba(15, 10, 6, 0.75);
  --scrim-border: rgba(240, 230, 216, 0.18);
  --on-image: #f0e6d8;
  --on-image-muted: #e2d6c4;
}
```

Keep the `* { box-sizing }`, `html { color-scheme; scroll-behavior: smooth }`, `body`, and `@media (prefers-reduced-motion)` rules that follow. Update `html { color-scheme: light dark; }` to keep both.

- [ ] **Step 2: Verify build passes and no token references dangle**

Run: `npm run build`
Expected: PASS. (No component references `--parchment`/`--room-bg` anymore — those were book-only, deleted in Task 1.)

- [ ] **Step 3: Commit**

```bash
git add src/theme/tokens.css
git commit -m "feat: retune design tokens to coffee palette"
```

---

### Task 3: Skills data

**Files:**
- Create: `src/data/skills.ts`
- Test: `src/data/skills.test.ts`

**Interfaces:**
- Produces: `interface SkillGroup { category: string; items: string[] }` and `export const skillGroups: SkillGroup[]`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest'
import { skillGroups } from './skills'

describe('skillGroups', () => {
  it('has five non-empty categories with unique names', () => {
    expect(skillGroups).toHaveLength(5)
    const names = skillGroups.map((g) => g.category)
    expect(new Set(names).size).toBe(5)
    for (const g of skillGroups) {
      expect(g.items.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/skills.test.ts`
Expected: FAIL — cannot find module `./skills`.

- [ ] **Step 3: Create `src/data/skills.ts`**

```ts
export interface SkillGroup {
  category: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'Spring Boot', 'REST APIs', 'JWT Auth', 'WebSockets'] },
  { category: 'Database', items: ['MongoDB', 'PostgreSQL', 'Redis', 'Firebase'] },
  { category: 'DevOps & Tools', items: ['Git', 'GitHub', 'Docker', 'Vercel', 'Railway'] },
  { category: 'Languages', items: ['C++', 'C', 'Python', 'JavaScript', 'TypeScript'] },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/skills.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/skills.ts src/data/skills.test.ts
git commit -m "feat: add categorized skills data"
```

---

### Task 4: Active-section hook

**Files:**
- Create: `src/lib/useActiveSection.ts`
- Test: `src/lib/useActiveSection.test.ts`

**Interfaces:**
- Produces: `export function useActiveSection(ids: string[]): string` — returns the id of the currently active section, defaulting to `ids[0]`.

- [ ] **Step 1: Write the failing test**

The hook uses IntersectionObserver, which jsdom lacks. Test that it returns the first id by default and updates when an observed entry becomes intersecting via a mocked observer.

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveSection } from './useActiveSection'

type Cb = (entries: Array<{ target: { id: string }; isIntersecting: boolean; intersectionRatio: number }>) => void
let lastCb: Cb

beforeEach(() => {
  lastCb = () => {}
  class IO {
    constructor(cb: Cb) { lastCb = cb }
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('IntersectionObserver', IO as unknown as typeof IntersectionObserver)
  // getElementById returns a stub element carrying its id
  vi.spyOn(document, 'getElementById').mockImplementation((id: string) => ({ id }) as HTMLElement)
})

describe('useActiveSection', () => {
  it('defaults to the first id', () => {
    const { result } = renderHook(() => useActiveSection(['home', 'about']))
    expect(result.current).toBe('home')
  })

  it('updates when a section becomes active', () => {
    const { result } = renderHook(() => useActiveSection(['home', 'about']))
    act(() => {
      lastCb([{ target: { id: 'about' }, isIntersecting: true, intersectionRatio: 0.9 }])
    })
    expect(result.current).toBe('about')
  })
})
```

- [ ] **Step 2: Confirm the test runner has `@testing-library/react`**

Run: `npm ls @testing-library/react`
Expected: if MISSING, install it: `npm install -D @testing-library/react`. (Needed for `renderHook`.)

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/useActiveSection.test.ts`
Expected: FAIL — cannot find module `./useActiveSection`.

- [ ] **Step 4: Create `src/lib/useActiveSection.ts`**

```ts
import { useEffect, useState } from 'react'

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/useActiveSection.test.ts`
Expected: PASS (both cases).

- [ ] **Step 6: Commit**

```bash
git add src/lib/useActiveSection.ts src/lib/useActiveSection.test.ts package.json package-lock.json
git commit -m "feat: add active-section IntersectionObserver hook"
```

---

### Task 5: Shared layout primitives — SectionHeading, Nav, Footer

**Files:**
- Create: `src/components/SectionHeading.tsx`
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `useActiveSection` (Task 4), `Reveal` (existing), `ThemeToggle` (existing).
- Produces: `SectionHeading({ kicker?, title })`, `Nav()`, `Footer()`.
- Nav link targets and the section id list are the canonical ids from Global Constraints.

- [ ] **Step 1: Create `src/components/SectionHeading.tsx`**

```tsx
import { Reveal } from './Reveal'

export function SectionHeading({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <Reveal>
      <div style={{ marginBottom: 40 }}>
        {kicker && (
          <p style={{
            margin: 0, fontFamily: "'Fira Code', monospace", fontSize: 13,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)',
          }}>{kicker}</p>
        )}
        <h2 style={{
          margin: '8px 0 0', fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--fg)', lineHeight: 1.1,
        }}>{title}</h2>
      </div>
    </Reveal>
  )
}
```

- [ ] **Step 2: Create `src/components/Nav.tsx`**

```tsx
import { useActiveSection } from '../lib/useActiveSection'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const active = useActiveSection(LINKS.map((l) => l.id))
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(12px)', background: 'color-mix(in srgb, var(--bg) 78%, transparent)',
      borderBottom: '1px solid var(--border)',
    }}>
      <nav style={{
        maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <a href="#home" style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22,
          color: 'var(--fg)', textDecoration: 'none',
        }}>Moises<span style={{ color: 'var(--accent)' }}>.</span></a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ul style={{
            display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0,
          }} className="nav-links">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} style={{
                  display: 'inline-block', padding: '8px 12px', borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15, textDecoration: 'none',
                  color: active === l.id ? 'var(--accent)' : 'var(--fg-muted)',
                  fontWeight: active === l.id ? 600 : 400, transition: 'color 0.2s',
                }}>{l.label}</a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
```

Add a responsive rule so the link list hides on narrow screens (append to `src/index.css`):

```css
@media (max-width: 720px) {
  .nav-links { display: none !important; }
}
```

- [ ] **Step 3: Create `src/components/Footer.tsx`**

```tsx
const GITHUB = 'https://github.com/moi-script'
const EMAIL = 'nugalmoises62@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace with real LinkedIn URL

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)', padding: '32px 24px',
      display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
      justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto',
    }}>
      <p style={{ margin: 0, color: 'var(--fg-faint)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        © 2026 John Moises
      </p>
      <div style={{ display: 'flex', gap: 18, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <a href={GITHUB} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>GitHub</a>
        <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>LinkedIn</a>
        <a href={`mailto:${EMAIL}`} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Email</a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS. (Components are unused until Task 13 — that's fine for tsc since they're exported modules; if `noUnusedLocals` flags anything, it's inside a file, not cross-file.)

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionHeading.tsx src/components/Nav.tsx src/components/Footer.tsx src/index.css
git commit -m "feat: add nav, footer, and section heading primitives"
```

---

### Task 6: Hero section

**Files:**
- Create: `src/sections/Hero.tsx`

**Interfaces:**
- Consumes: `profile_pic_1.png`, `Reveal`.
- Produces: `Hero()` rendering `<section id="home">`.

- [ ] **Step 1: Create `src/sections/Hero.tsx`**

```tsx
import type { CSSProperties } from 'react'
import { Reveal } from '../components/Reveal'
import portrait from '../assets/profile_pic_1.png'

const RESUME = '/resume.pdf' // TODO: drop resume.pdf into public/
const GITHUB = 'https://github.com/moi-script'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace
const EMAIL = 'nugalmoises62@gmail.com'

const btnBase: CSSProperties = {
  padding: '13px 26px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
  fontSize: 15, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  display: 'inline-block', transition: 'transform 0.15s, opacity 0.2s',
}

export function Hero() {
  return (
    <section id="home" style={{ padding: '48px 24px 24px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', background: 'var(--bg-elev)',
        border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden',
        boxShadow: 'var(--shadow)', position: 'relative',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        alignItems: 'center', gap: 24,
      }} className="hero-grid">
        {/* accent glow */}
        <div aria-hidden style={{
          position: 'absolute', right: '8%', top: '20%', width: 340, height: 340,
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.28, filter: 'blur(30px)', pointerEvents: 'none',
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
            }}>Full-Stack &amp; AI Developer</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{
              margin: '20px 0 0', maxWidth: 460, fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, lineHeight: 1.7, color: 'var(--fg-muted)',
            }}>
              I'm a Computer Engineering student who builds modern full-stack web
              applications with React, Node.js, and MongoDB, and integrates AI into
              real-world products.
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
        <div style={{ position: 'relative', alignSelf: 'stretch', minHeight: 420 }} className="hero-photo">
          <img src={portrait} alt="John Moises" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
            filter: 'grayscale(0.4) sepia(0.55) saturate(1.35) hue-rotate(-12deg) contrast(1.02)',
          }} />
          {/* coffee duotone + fade into the card */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, var(--bg-elev) 0%, transparent 22%), linear-gradient(0deg, var(--bg-elev) 2%, transparent 30%), radial-gradient(circle at 60% 40%, rgba(200,135,79,0.22), transparent 60%)',
            mixBlendMode: 'normal',
          }} />
        </div>
      </div>
    </section>
  )
}
```

Append responsive rules to `src/index.css`:

```css
@media (max-width: 860px) {
  .hero-grid { grid-template-columns: 1fr !important; }
  .hero-photo { min-height: 300px !important; order: -1; }
}
```

- [ ] **Step 2: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Hero.tsx src/index.css
git commit -m "feat: add coffee-themed hero section"
```

---

### Task 7: About section

**Files:**
- Create: `src/sections/About.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `Reveal`.
- Produces: `About()` rendering `<section id="about">`.

- [ ] **Step 1: Create `src/sections/About.tsx`**

```tsx
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const STATS = [
  { value: '5', label: 'Projects shipped & in dev' },
  { value: 'MERN', label: 'Primary stack' },
  { value: 'AI', label: 'RAG · OCR · Agents' },
]

export function About() {
  return (
    <section id="about" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Who I am" title="About Me" />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 40 }} className="about-grid">
        <Reveal>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8, color: 'var(--fg-muted)' }}>
            <p style={{ marginTop: 0 }}>
              I'm a Computer Engineering student passionate about building scalable web
              applications and integrating AI into real-world solutions. I work across the
              full stack, from database schema design to polished front-end interfaces.
            </p>
            <p style={{ marginBottom: 0 }}>
              Right now I'm deepening my work in AI-driven products (RAG, OCR, agents) and
              starting to explore embedded systems and AI + IoT, combining the software and
              hardware sides of my engineering background.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gap: 14 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{
                background: 'var(--bg-elev)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '18px 20px',
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: 'var(--accent)' }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--fg-faint)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
```

Append to `src/index.css`:

```css
@media (max-width: 720px) {
  .about-grid { grid-template-columns: 1fr !important; }
}
```

- [ ] **Step 2: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/sections/About.tsx src/index.css
git commit -m "feat: add about section"
```

---

### Task 8: Skills section

**Files:**
- Create: `src/sections/Skills.tsx`

**Interfaces:**
- Consumes: `skillGroups` (Task 3), `SectionHeading`, `Reveal`.
- Produces: `Skills()` rendering `<section id="skills">`.

- [ ] **Step 1: Create `src/sections/Skills.tsx`**

```tsx
import { skillGroups } from '../data/skills'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Skills() {
  return (
    <section id="skills" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="How I build" title="Skills & Tools" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.06}>
            <div style={{
              background: 'var(--bg-elev)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 24, height: '100%',
            }}>
              <h3 style={{
                margin: '0 0 16px', fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 18, color: 'var(--fg)',
              }}>{group.category}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {group.items.map((item) => (
                  <span key={item} style={{
                    padding: '6px 12px', borderRadius: 999, fontFamily: "'Fira Code', monospace",
                    fontSize: 13, color: 'var(--fg-muted)', background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                    border: '1px solid var(--border)',
                  }}>{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Skills.tsx
git commit -m "feat: add skills section"
```

---

### Task 9: Projects section + card

**Files:**
- Create: `src/sections/ProjectCard.tsx`
- Create: `src/sections/Projects.tsx`

**Interfaces:**
- Consumes: `projects` and `Project` type from `src/data/projects.ts`, `SectionHeading`, `Reveal`.
- Produces: `ProjectCard({ project })`, `Projects()` rendering `<section id="projects">`.

- [ ] **Step 1: Create `src/sections/ProjectCard.tsx`**

```tsx
import type { Project } from '../data/projects'

export function ProjectCard({ project }: { project: Project }) {
  const shipped = project.status === 'shipped'
  return (
    <article style={{
      background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 18,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      boxShadow: 'var(--shadow)', transition: 'transform 0.2s',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {project.image && (
        <div style={{ position: 'relative', aspectRatio: '16 / 10', overflow: 'hidden', background: '#000' }}>
          <img src={project.image} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <span style={{
            position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 999,
            fontFamily: "'Fira Code', monospace", fontSize: 11, letterSpacing: '0.05em',
            background: 'var(--scrim)', border: '1px solid var(--scrim-border)',
            color: shipped ? '#7ee0a8' : '#e0a668',
          }}>{shipped ? 'SHIPPED' : 'IN DEVELOPMENT'}</span>
        </div>
      )}
      <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--fg)' }}>{project.name}</h3>
          <p style={{ margin: '4px 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--fg-faint)' }}>{project.year} · {project.subject}</p>
        </div>
        <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
          "{project.quote}"
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 'auto' }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              padding: '4px 10px', borderRadius: 999, fontFamily: "'Fira Code', monospace",
              fontSize: 12, color: 'var(--fg-muted)', border: '1px solid var(--border)',
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          {project.liveDemo && (
            <a href={project.liveDemo} target="_blank" rel="noreferrer" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
              color: 'var(--accent)', textDecoration: 'none',
            }}>Live Demo →</a>
          )}
          <a href={project.github} target="_blank" rel="noreferrer" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            color: 'var(--fg-muted)', textDecoration: 'none',
          }}>GitHub →</a>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Create `src/sections/Projects.tsx`**

```tsx
import { projects } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Projects() {
  return (
    <section id="projects" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="What I've built" title="Featured Projects" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 2) * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/sections/ProjectCard.tsx src/sections/Projects.tsx
git commit -m "feat: add featured projects section"
```

---

### Task 10: GitHub activity section

**Files:**
- Create: `src/sections/GitHub.tsx`

**Interfaces:**
- Consumes: `react-github-calendar` (installed), `useTheme` (existing), `SectionHeading`.
- Produces: `GitHub()` rendering `<section id="github">`.

- [ ] **Step 1: Create `src/sections/GitHub.tsx`**

```tsx
import GitHubCalendar from 'react-github-calendar'
import { useTheme } from '../theme/ThemeContext'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const coffeeLevels = {
  light: ['#eaddc9', '#e0c39a', '#cf9d63', '#b87a3d', '#8a5424'],
  dark: ['#241812', '#5a3c20', '#8a5424', '#c8874f', '#e0a668'],
}

export function GitHub() {
  const { theme } = useTheme()
  return (
    <section id="github" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Consistency" title="GitHub Activity" />
      <Reveal>
        <div style={{
          background: 'var(--bg-elev)', border: '1px solid var(--border)',
          borderRadius: 18, padding: 'clamp(20px, 4vw, 36px)', overflowX: 'auto',
          color: 'var(--fg-muted)', fontFamily: "'DM Sans', sans-serif",
        }}>
          <GitHubCalendar
            username="moi-script"
            colorScheme={theme}
            theme={{ light: coffeeLevels.light, dark: coffeeLevels.dark }}
            fontSize={13}
            blockSize={12}
          />
        </div>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS. If tsc complains about the `theme` prop shape, the library expects `{ light: string[]; dark: string[] }` with exactly 5 entries — the arrays above satisfy that.

- [ ] **Step 3: Commit**

```bash
git add src/sections/GitHub.tsx
git commit -m "feat: add github activity section"
```

---

### Task 11: Timeline section

**Files:**
- Create: `src/sections/Timeline.tsx`

**Interfaces:**
- Consumes: `acts` from `src/data/story.ts`, `SectionHeading`, `Reveal`.
- Produces: `Timeline()` rendering `<section id="journey">`.

- [ ] **Step 1: Create `src/sections/Timeline.tsx`**

```tsx
import { acts } from '../data/story'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Timeline() {
  return (
    <section id="journey" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="How I got here" title="My Journey" />
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        <div aria-hidden style={{
          position: 'absolute', left: 7, top: 6, bottom: 6, width: 2,
          background: 'linear-gradient(var(--accent), transparent)',
        }} />
        {acts.map((act, i) => (
          <Reveal key={act.id} delay={i * 0.08}>
            <div style={{ position: 'relative', paddingBottom: 36 }}>
              <span aria-hidden style={{
                position: 'absolute', left: -32, top: 4, width: 16, height: 16, borderRadius: '50%',
                background: 'var(--accent)', border: '3px solid var(--bg)',
              }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: 'var(--accent)' }}>{act.index}</span>
                <h3 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--fg)' }}>{act.title}</h3>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--fg-faint)' }}>{act.kicker}</span>
              </div>
              <p style={{ margin: '8px 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: 'var(--fg-muted)' }}>{act.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Timeline.tsx
git commit -m "feat: add journey timeline section"
```

---

### Task 12: Contact section

**Files:**
- Create: `src/sections/Contact.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `Reveal`.
- Produces: `Contact()` rendering `<section id="contact">`.

- [ ] **Step 1: Create `src/sections/Contact.tsx`**

```tsx
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const GITHUB = 'https://github.com/moi-script'
const EMAIL = 'nugalmoises62@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace
const RESUME = '/resume.pdf' // TODO: drop resume.pdf into public/

const LINKS = [
  { label: 'Email', href: `mailto:${EMAIL}`, value: EMAIL },
  { label: 'GitHub', href: GITHUB, value: 'github.com/moi-script' },
  { label: 'LinkedIn', href: LINKEDIN, value: 'Connect with me' },
]

export function Contact() {
  return (
    <section id="contact" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Why hire me" title="Let's Build Something" />
      <Reveal>
        <p style={{ marginTop: 0, maxWidth: 560, fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.7, color: 'var(--fg-muted)' }}>
          I'm open to internships, freelance work, and collaboration. If you're building
          something ambitious, I'd love to hear about it.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 24 }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target={l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" style={{
              background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14,
              padding: '18px 20px', textDecoration: 'none', display: 'block',
            }}>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--fg)', marginTop: 6 }}>{l.value}</div>
            </a>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.18}>
        <a href={RESUME} download style={{
          display: 'inline-block', marginTop: 24, padding: '13px 26px', borderRadius: 10,
          background: 'var(--accent)', color: '#1a120b', fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 600, textDecoration: 'none',
        }}>Download Resume</a>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Verify build and lint pass**

Run: `npm run build && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Contact.tsx
git commit -m "feat: add contact section"
```

---

### Task 13: Compose the page

**Files:**
- Modify: `src/App.tsx`
- Create: `public/resume.pdf` placeholder note (see step)

**Interfaces:**
- Consumes: all sections + `Nav` + `Footer`.

- [ ] **Step 1: Rewrite `src/App.tsx`**

```tsx
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { GitHub } from './sections/GitHub'
import { Timeline } from './sections/Timeline'
import { Contact } from './sections/Contact'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', overflowX: 'hidden' }}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHub />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Add a resume placeholder so the download link resolves in dev**

Create `public/README-resume.txt`:

```
Drop your real resume here as `resume.pdf`.
The Hero and Contact "Download Resume" buttons link to /resume.pdf.
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — `skills.test.ts` and `useActiveSection.test.ts` green; no book tests remain.

- [ ] **Step 4: Verify production build and lint**

Run: `npm run build && npm run lint`
Expected: PASS with no errors.

- [ ] **Step 5: Manual smoke check**

Run: `npm run dev`, open the served URL. Verify: hero renders with coffee-tinted portrait, nav links smooth-scroll and highlight the active section, theme toggle flips espresso ↔ latte, project cards show real screenshots + working links, GitHub calendar loads, timeline and contact render. Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx public/README-resume.txt
git commit -m "feat: compose coffee scrolling portfolio page"
```

---

## Notes for the implementer

- **`Reveal` import paths:** `Reveal` lives at `src/components/Reveal.tsx`. Sections in `src/sections/` import it as `../components/Reveal`; components in `src/components/` import it as `./Reveal`.
- **Colors:** never hardcode hex in components except the two on-accent text colors (`#1a120b` on caramel buttons) and the GitHub calendar level arrays. Everything else uses `var(--*)`.
- **`color-mix`:** used for nav backdrop and skill chips; supported in all current evergreen browsers and Vite's target. If a lint/build target complains, fall back to a fixed `rgba`.
- **eslint `react-refresh/only-export-components`:** if a section file exports non-component constants and trips this rule, move the constant above the component in the same file (constants are fine; it only flags exported non-components). None of the section files export extra symbols, so this shouldn't fire.
```
