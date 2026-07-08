# Portfolio Cinematic Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a light-first, cinematic scroll story ("Build Log") with a light/dark theme system, all 5 projects, a GitHub contribution graph, and no AI/chatbot.

**Architecture:** Single-page React app. A `ThemeProvider` drives CSS custom properties via `data-theme` on `<html>`. `App.tsx` composes ordered sections (Hero → Story Acts → Frontier → Contributions → About → Contact → Footer). Content lives in typed data files (`data/projects.ts`, `data/story.ts`). Motion is tasteful framer-motion scroll-reveal that respects `prefers-reduced-motion`. The old `Moi.tsx` monolith is decomposed into focused units.

**Tech Stack:** React 19, TypeScript 5, Vite 7, framer-motion, react-github-calendar. Build with huashu-design for visual direction; copy passed through humanizer.

## Global Constraints

- **No AI / no chatbot / no backend / no serverless** anywhere.
- **Default theme is light**; dark is a manual toggle. Do NOT follow system preference.
- **All colors read from CSS custom properties** — no hardcoded `#04070e` / `#00ff88` literals in component layout. Neon green (`#00ff88`) is a **dark-mode-only** accent token value.
- **Accent = deep ink + a single electric blue** in light mode.
- **Only two new dependencies allowed:** `react-github-calendar`, `framer-motion`.
- **LOCA and Profy.ai have NO live-demo link** and must show an `IN DEVELOPMENT` badge. GitHub link only.
- **Contribution graph username = `moi-script`.**
- **Respect `prefers-reduced-motion`**: reveals/pinning collapse to instant, content stays fully readable.
- **Verification loop per task** (no unit-test framework in this repo): `npm run build` passes clean, `npm run lint` passes, plus the visual check stated in the task via `npm run dev`.
- **Commit after every task.** Co-Authored-By trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Preserve existing working assets: `Hire.tsx` (reused), CV file in `public/`, project images in `src/assets/`.

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json` (dependencies)

**Interfaces:**
- Produces: `framer-motion` and `react-github-calendar` importable in later tasks.

- [ ] **Step 1: Install the two allowed deps**

```bash
npm install framer-motion react-github-calendar
```

- [ ] **Step 2: Verify they resolve and the app still builds**

Run: `npm run build`
Expected: build succeeds; `package.json` now lists `framer-motion` and `react-github-calendar` under `dependencies`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion and react-github-calendar"
```

---

### Task 2: Theme tokens (CSS custom properties)

**Files:**
- Create: `src/theme/tokens.css`
- Modify: `src/main.tsx` (import the stylesheet)

**Interfaces:**
- Produces: CSS variables available globally on `:root[data-theme="light"]` and `:root[data-theme="dark"]`. Every later component reads these.

Token contract (names later tasks depend on — use exactly these):
`--bg`, `--bg-elev`, `--fg`, `--fg-muted`, `--fg-faint`, `--border`, `--accent`, `--accent-2`, `--code-bg`, `--code-fg`, `--shadow`.

- [ ] **Step 1: Write `src/theme/tokens.css`**

```css
/* Fonts + design tokens. Light is the base; dark overrides. */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Fira+Code:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

:root, :root[data-theme="light"] {
  --bg: #f4f6fb;
  --bg-elev: #ffffff;
  --fg: #0b1220;
  --fg-muted: #47536b;
  --fg-faint: #8b97ac;
  --border: rgba(11, 18, 32, 0.10);
  --accent: #0b1220;        /* deep ink */
  --accent-2: #2f6bff;      /* electric blue */
  --code-bg: #0f1626;
  --code-fg: #cbd5e1;
  --shadow: 0 20px 60px rgba(11, 18, 32, 0.08);
}

:root[data-theme="dark"] {
  --bg: #04070e;
  --bg-elev: rgba(8, 12, 22, 0.8);
  --fg: #f1f5f9;
  --fg-muted: #94a3b8;
  --fg-faint: #475569;
  --border: rgba(255, 255, 255, 0.07);
  --accent: #00ff88;        /* neon green — dark only */
  --accent-2: #00d4ff;
  --code-bg: rgba(0, 0, 0, 0.4);
  --code-fg: #7dd3fc;
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

* { box-sizing: border-box; }
html { color-scheme: light dark; }
body { margin: 0; background: var(--bg); color: var(--fg); transition: background 0.4s, color 0.4s; }

@keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
@keyframes scanline { 0%{transform:translateY(0);opacity:1;} 100%{transform:translateY(200px);opacity:0;} }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Import it in `src/main.tsx`**

Add near the top of `src/main.tsx` (alongside the existing `index.css` import):

```tsx
import './theme/tokens.css'
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS. `npm run dev` shows the page background is now light (`#f4f6fb`).

- [ ] **Step 4: Commit**

```bash
git add src/theme/tokens.css src/main.tsx
git commit -m "feat: add light-first theme tokens"
```

---

### Task 3: ThemeContext + provider (no-flash, persisted)

**Files:**
- Create: `src/theme/ThemeContext.tsx`
- Modify: `src/main.tsx` (wrap app in provider)
- Modify: `index.html` (inline pre-paint theme script)

**Interfaces:**
- Produces:
  - `type Theme = 'light' | 'dark'`
  - `useTheme(): { theme: Theme; toggle: () => void }`
  - `<ThemeProvider>{children}</ThemeProvider>`
  - Default theme when nothing stored: `'light'`. Persist key: `localStorage['moi-theme']`.

- [ ] **Step 1: Write `src/theme/ThemeContext.tsx`**

```tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeCtx { theme: Theme; toggle: () => void }
const Ctx = createContext<ThemeCtx | null>(null)

function initialTheme(): Theme {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('moi-theme') : null
  return stored === 'dark' ? 'dark' : 'light' // light-first; ignore system
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('moi-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme must be used within ThemeProvider')
  return v
}
```

- [ ] **Step 2: Add pre-paint script to `index.html`**

Inside `<head>` of `index.html`, before the module script, add:

```html
<script>
  (function () {
    var t = localStorage.getItem('moi-theme');
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  })();
</script>
```

- [ ] **Step 3: Wrap the app in `src/main.tsx`**

Wrap the rendered root element in `<ThemeProvider>`:

```tsx
import { ThemeProvider } from './theme/ThemeContext'
// ...
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

(Keep whatever component `App`/`MoiPortfolio` is currently rendered; just wrap it.)

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS. In `npm run dev`, `document.documentElement` has `data-theme="light"` on first load; setting `localStorage['moi-theme']='dark'` and reloading paints dark with no light flash.

- [ ] **Step 5: Commit**

```bash
git add src/theme/ThemeContext.tsx src/main.tsx index.html
git commit -m "feat: add persisted light-first theme provider with no-flash init"
```

---

### Task 4: Typed project + story data

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/story.ts`
- Modify: copy images — `src/assets/loca.png`, `src/assets/profy.png`

**Interfaces:**
- Produces:
  - `interface Journey { turning_point: string; the_struggle: string; what_i_built: string[]; what_i_learned: string; milestone: string }`
  - `interface Project { id: string; name: string; status: 'shipped' | 'in-development'; year: string; subject: string; tags: string[]; accentColor: string; quote: string; journey: Journey; github: string; liveDemo?: string; image?: string }`
  - `export const projects: Project[]` (5 entries, order: gameTrigger, engineeringPortal, recepta, loca, profy)
  - `interface Act { id: string; index: string; title: string; kicker: string; body: string }`
  - `export const acts: Act[]` (foundation, spark, trial, ascent — 4 narration acts)

- [ ] **Step 1: Copy the two new images into assets**

```bash
cp newProjectsPic/LOCA.png src/assets/loca.png
cp newProjectsPic/Crypto.png src/assets/profy.png
```

- [ ] **Step 2: Write `src/data/projects.ts`**

Reuse the existing project journey copy from the current `Moi.tsx` for Game Trigger, Engineering Portal, and Recepta verbatim (they are already hand-written and good). Add LOCA and Profy.ai. Full file:

```ts
import receptaImg from '../assets/recepta.png'
import triggerImg from '../assets/trigger_game.png'
import portalImg from '../assets/engr_portal.png'
import locaImg from '../assets/loca.png'
import profyImg from '../assets/profy.png'

export interface Journey {
  turning_point: string
  the_struggle: string
  what_i_built: string[]
  what_i_learned: string
  milestone: string
}

export interface Project {
  id: string
  name: string
  status: 'shipped' | 'in-development'
  year: string
  subject: string
  tags: string[]
  accentColor: string
  quote: string
  journey: Journey
  github: string
  liveDemo?: string
  image?: string
}

export const projects: Project[] = [
  {
    id: 'game-trigger',
    name: 'Game Trigger',
    status: 'shipped',
    year: '1st Year',
    subject: 'Object Oriented Programming',
    tags: ['HTML', 'CSS', 'JavaScript', 'DOM', 'Web Audio API'],
    accentColor: '#00ff88',
    quote: 'C++ taught me how computers think. JavaScript showed me code could be beautiful.',
    github: 'https://github.com/moi-script/Trigger_Game_Project',
    liveDemo: 'https://trigger-game-project.vercel.app/',
    image: triggerImg,
    journey: {
      turning_point: "Coming from the rigid, low-level world of C++, the DOM felt like moving from a calculator to a canvas. Web development was completely different — high-tech, alive, and way more interesting than I expected. This project was my turning point.",
      the_struggle: "JavaScript was completely new territory. Event listeners, DOM manipulation, Browser APIs — concepts that don't exist in C++. Writing my first real-time game loop with sound effects using the Web Audio API while under deadline pressure tested my consistency hard.",
      what_i_built: ['DOM Events', 'Web Audio API', 'Game Loop', 'CSS Animations', 'Score System', 'Sound Integration'],
      what_i_learned: "JavaScript is more interesting than I thought. Seeing HTML, CSS, and JS combine to make something lively and beautiful — a game that responds to you with sound and motion — was the moment I understood why people love front-end development. It improved my algorithmic thinking massively.",
      milestone: "1st Place — Computer Engineering Week. Not just a certificate — it was validation that my algorithmic thinking could solve real, interactive problems under a deadline. It turned a curiosity into a passion that I still carry today.",
    },
  },
  {
    id: 'engineering-portal',
    name: 'Engineering Portal',
    status: 'shipped',
    year: '2nd Year',
    subject: 'Data Structures & Algorithms',
    tags: ['React', 'Node.js', 'Spring Boot', 'WebSocket', 'MongoDB', 'Charts'],
    accentColor: '#7c3aed',
    quote: 'I started frontend first. I suffered miserably. Now I always start with the schema.',
    github: 'https://github.com/moi-script/engineering_portal',
    liveDemo: 'https://engineering-portal-front.vercel.app/',
    image: portalImg,
    journey: {
      turning_point: "If Game Trigger was my honeymoon phase, the Engineering Portal was my trial by fire. This project forced me to grow up as a developer — stepping away from AI reliance and diving deep into React and System Design at the same time.",
      the_struggle: "I built it frontend → backend → database. That was wrong. I ended up in constant, painful refactoring cycles because my frontend didn't match the data I actually needed. The multi-role system (Admin, Teacher, Student) and real-time chat made it ten times more complex.",
      what_i_built: ['Multi-role Auth', 'Real-time Chat', 'WebSocket', 'Progress Charts', 'Admin Dashboard', 'DB Schema Design'],
      what_i_learned: "Always start with the schema. Schema-first design saves weeks of pain. Also: real-time data processing via WebSocket was the most satisfying technical concept I discovered here — seeing messages appear without a page refresh felt like magic.",
      milestone: "Seeing the complex database schema finally click with the UI after weeks of refactoring — and submitting a system where admins, teachers, and students could all interact in real-time. Patience and consistency made this achievable.",
    },
  },
  {
    id: 'recepta',
    name: 'Recepta',
    status: 'shipped',
    year: '2026–Present',
    subject: 'Personal SaaS Project',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Azure AI', 'RAG', 'OCR'],
    accentColor: '#00d4ff',
    quote: 'This is where I realized software is a global collaboration.',
    github: 'https://github.com/moi-script/YourCeipt',
    liveDemo: 'https://recepta-phi.vercel.app/',
    image: receptaImg,
    journey: {
      turning_point: "Recepta is my best project to date — and I'm planning to market it as my first SaaS. It was the project that made me realize how vast the software world actually is. Not just a budget tracker, it's an AI-driven financial ecosystem.",
      the_struggle: "This took a long time to build — planning, designing, database architecture, AI integration, RAG, OCR, and third-party APIs. Each layer taught me something new. The hardest part was making all these systems talk to each other seamlessly.",
      what_i_built: ['Azure OCR', 'RAG System', 'AI Smart Text', 'Vector DB', 'Full MERN Stack', 'Third-party APIs'],
      what_i_learned: "Building Recepta made me humble. Every tool I used — from open source libraries to high-end APIs — is the result of real people with hard work and talent. In the software world, we are one as a whole, helping each other solve problems.",
      milestone: "The moment: pointing a camera at a receipt and seeing Azure AI analyze prices, dates, and items into structured data faster than I could think — then watching the budget update instantly. That's when I knew full-stack development was my path.",
    },
  },
  {
    id: 'loca',
    name: 'LOCA',
    status: 'in-development',
    year: '2026 · In Development',
    subject: 'Hyperlocal Spatial Commerce Platform',
    tags: ['Next.js 16', 'React 19', 'MapLibre GL', 'Tailwind v4', 'Zustand', 'Three.js', 'Socket.io'],
    accentColor: '#2f6bff',
    quote: 'A whole city, mapped — Pasabuy running on top of a live business map.',
    github: 'https://github.com/moi-script/centralized_business_map',
    image: locaImg,
    journey: {
      turning_point: "LOCA is a map-first super-app for Filipino residential communities — discover nearby businesses, run errands through Pasabuy, earn from hyperlocal microtasks, and manage your HOA, all from one live spatial interface.",
      the_struggle: "Serving two completely different users from one database through a single map: consumers asking 'should I go here right now?' and location scouts asking 'is this a good spot to open?'. Keeping the map fast at high pin density meant a two-stage fetch and a best-spot scoring model.",
      what_i_built: ['Live MapLibre Map', 'Pasabuy Errand Market', 'Microtasks', 'HOA Admin', 'AR View (Three.js)', '5-role RBAC'],
      what_i_learned: "How to design a real spatial product: theme-aware map styles, clustered pins, haversine distance computed live, and a RAG pipeline that turns nearby reviews and demographics into a plain-language location insight.",
      milestone: "A fully-designed, fully-interactive prototype where every screen exists and every flow is navigable — four user types (residents, owners, runners, HOA admins) sharing one map. Currently making the core loop real before adding surface area.",
    },
  },
  {
    id: 'profy',
    name: 'Profy.ai',
    status: 'in-development',
    year: '2026 · In Development',
    subject: 'Autonomous AI Crypto Trading Terminal',
    tags: ['Next.js', 'Express', 'Python', 'MongoDB Atlas', 'Redis', 'Celery', 'Docker', 'Socket.io'],
    accentColor: '#00d4ff',
    quote: 'Trade with the clarity of a machine.',
    github: 'https://github.com/moi-script/crypt_dashboard',
    image: profyImg,
    journey: {
      turning_point: "Profy.ai is an autonomous AI crypto trading terminal — live market data, a multi-framework analysis agent, a paper-trading engine with full position lifecycle, and a real-time dashboard, built as a monorepo with Next.js + Express + Python.",
      the_struggle: "Orchestrating three runtimes as one product: a Next.js frontend, an Express API, and a Python analysis worker, glued with MongoDB Atlas, Redis, Celery, and Socket.io — all inside Docker so a session can be spun up from scratch every time.",
      what_i_built: ['Live Market Data', 'AI Analysis Agent', 'Paper Trading Engine', 'Position Lifecycle', 'Real-time Dashboard', 'Celery Workers'],
      what_i_learned: "How production trading infrastructure fits together — real-time streaming over Socket.io, caching hot data in Redis, and running heavy AI analysis off the request path with Celery so the terminal stays responsive.",
      milestone: "A working terminal that streams real-time markets, runs AI-powered insights off the main thread, and simulates a full trade lifecycle end-to-end — professional tools in one place, built for serious traders.",
    },
  },
]
```

- [ ] **Step 3: Write `src/data/story.ts`**

Reuse the existing timeline copy from the current `Moi.tsx`:

```ts
export interface Act {
  id: string
  index: string
  title: string
  kicker: string
  body: string
}

export const acts: Act[] = [
  {
    id: 'foundation',
    index: '01',
    title: 'The Foundation',
    kicker: 'Before College',
    body: "C++ was my first language. Low-level, rigid, disciplined. It taught me how computers actually think — memory, pointers, logic. A tough but necessary foundation.",
  },
  {
    id: 'spark',
    index: '02',
    title: 'The Spark',
    kicker: '1st Year',
    body: "Game Trigger was built with HTML, CSS, and JavaScript in my OOP subject. Moving from C++ to the DOM felt like moving from a calculator to a canvas. Won 1st place in CompEng Week. Passion ignited.",
  },
  {
    id: 'trial',
    index: '03',
    title: 'The Trial',
    kicker: '2nd Year',
    body: "Engineering Portal for DSA class. Built a multi-role system with real-time chat and data visualization. Learned the hard lesson: always design the database schema first. Patience was tested. Character was built.",
  },
  {
    id: 'ascent',
    index: '04',
    title: 'The Ascent',
    kicker: 'Now',
    body: "Recepta — my first SaaS attempt. Azure OCR, RAG, AI text detection, full MERN stack. The project that made me realize the beauty of open source and software as a global collaboration.",
  },
]
```

- [ ] **Step 4: Verify build (type-check catches interface errors)**

Run: `npm run build`
Expected: PASS. No TypeScript errors; images resolve.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts src/data/story.ts src/assets/loca.png src/assets/profy.png
git commit -m "feat: add typed project and story data with LOCA and Profy.ai"
```

---

### Task 5: Reveal wrapper + ThemeToggle

**Files:**
- Create: `src/components/Reveal.tsx`
- Create: `src/components/ThemeToggle.tsx`

**Interfaces:**
- Consumes: `framer-motion`, `useTheme` from Task 3.
- Produces:
  - `<Reveal delay?={number} y?={number}>{children}</Reveal>` — fades + translates children in on scroll into view; instant when reduced-motion.
  - `<ThemeToggle />` — a button calling `toggle()`, showing sun in light / moon in dark.

- [ ] **Step 1: Write `src/components/Reveal.tsx`**

```tsx
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <>{children}</>
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Write `src/components/ThemeToggle.tsx`**

```tsx
import { useTheme } from '../theme/ThemeContext'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        width: 40, height: 40, borderRadius: 10, cursor: 'pointer',
        background: 'transparent', border: '1px solid var(--border)',
        color: 'var(--accent-2)', fontSize: 16, lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    >
      {theme === 'light' ? '☀' : '☾'}
    </button>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/Reveal.tsx src/components/ThemeToggle.tsx
git commit -m "feat: add Reveal scroll animation and ThemeToggle"
```

---

### Task 6: Nav (theme-aware, with toggle + mobile menu)

**Files:**
- Create: `src/components/Nav.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` (Task 5).
- Produces: `<Nav onHireClick={() => void} />` — fixed top nav; logo `moi.dev_`, links (Story, Work, About, Contact), `ThemeToggle`, Hire button, and a mobile hamburger.

- [ ] **Step 1: Write `src/components/Nav.tsx`**

Port the existing nav from `Moi.tsx` (logo, links, hamburger, mobile dropdown) but replace every hardcoded color with a token (`var(--fg-muted)`, `var(--accent)`, `var(--border)`, `var(--bg)`), swap link labels to `['Story', 'Work', 'About', 'Contact']` (hrefs `#story`, `#work`, `#about`, `#contact`), add `<ThemeToggle />` before the Hire button in the desktop cluster, and call `onHireClick` from both desktop and mobile Hire buttons. Nav background uses `var(--bg)` at ~0.9 alpha when scrolled. Keep the `scrolled` scroll listener and `mobileMenuOpen` state.

- [ ] **Step 2: Verify build + visual**

Run: `npm run build` then `npm run dev`
Expected: PASS. Nav shows a working theme toggle; clicking it flips light↔dark and every nav color updates; hamburger works below 768px.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: add theme-aware nav with theme toggle"
```

---

### Task 7: Hero (Act 00 — cold open)

**Files:**
- Create: `src/sections/Hero.tsx`

**Interfaces:**
- Consumes: `Reveal` (Task 5).
- Produces: `<Hero />` — full-viewport cinematic opening. Name, one identity line, stack line, two CTAs (View work `#work`, Download CV `/Moises_Nugal_CV_Polished.docx`), a subtle theme-aware animated grid/candlestick motif behind the text.

- [ ] **Step 1: Write `src/sections/Hero.tsx`**

Build a full-height `<section id="top">` reading all colors from tokens. Left column: kicker `// Initializing profile…` (var(--accent-2)), an `<h1>` "Hi, I'm Moi." in Syne, a muted identity line ("Computer Engineering student building systems that earn their keep."), a `Fira Code` stack line, two CTA `<a>` buttons (primary uses `background: var(--accent-2); color: var(--bg-elev)`; secondary is outlined `var(--accent-2)`), and a row of stat pills. Background motif: an absolutely-positioned div with the token-driven grid gradient (`linear-gradient(var(--border) 1px, transparent 1px)` both axes, `64px` size) plus a faint radial glow using `var(--accent-2)` at low alpha. Wrap text blocks in `<Reveal>` with staggered delays. Motif opacity stays low (≤0.5) so text is readable in both themes.

- [ ] **Step 2: Verify build + visual**

Run: `npm run build` then `npm run dev`
Expected: PASS. Hero fills the viewport, reads cleanly in light mode, CTAs work, motif is subtle in both themes.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Hero.tsx
git commit -m "feat: add cinematic hero (Act 00)"
```

---

### Task 8: StoryAct (Acts 01–04, pinned/scrubbed narration)

**Files:**
- Create: `src/sections/StoryAct.tsx`
- Create: `src/sections/Story.tsx`

**Interfaces:**
- Consumes: `acts` (Task 4), `framer-motion` (`useScroll`, `useTransform`), `useReducedMotion`.
- Produces:
  - `<StoryAct act={Act} />` — a tall section with a sticky inner panel; as it scrolls, the big index number and title scrub in opacity/position. Falls back to static (no scrub) under reduced-motion.
  - `<Story />` — `<section id="story">` header ("From C++ to shipping systems") + maps `acts` to `<StoryAct>`.

- [ ] **Step 1: Write `src/sections/StoryAct.tsx`**

Use a `useRef` on the outer section, `const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })`, and `useTransform` to drive opacity (0.2→1→0.2) and a small `y` on the sticky inner content. Guard with `useReducedMotion()` — when true, render the content statically (no motion values). Inner panel is `position: sticky; top: 20vh`, shows a large `var(--accent-2)` index (`act.index`), the `act.kicker` in Fira Code, `act.title` in Syne, and `act.body` in DM Sans. All colors from tokens. Outer section `min-height: 150vh` to give scrub room (desktop); on `max-width: 768px` relax to `auto` height and static.

- [ ] **Step 2: Write `src/sections/Story.tsx`**

```tsx
import { acts } from '../data/story'
import { StoryAct } from './StoryAct'
import { Reveal } from '../components/Reveal'

export function Story() {
  return (
    <section id="story" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 48px 0' }}>
        <Reveal>
          <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-2)', margin: '0 0 8px' }}>// The build log</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(26px,4vw,44px)', color: 'var(--fg)', margin: 0, letterSpacing: '-0.02em' }}>From C++ to shipping systems.</h2>
        </Reveal>
      </div>
      {acts.map(a => <StoryAct key={a.id} act={a} />)}
    </section>
  )
}
```

- [ ] **Step 3: Verify build + visual**

Run: `npm run build` then `npm run dev`
Expected: PASS. Scrolling through the story pins each act and scrubs the number/title; enabling OS "reduce motion" makes them static and fully readable.

- [ ] **Step 4: Commit**

```bash
git add src/sections/StoryAct.tsx src/sections/Story.tsx
git commit -m "feat: add pinned story acts (Acts 01-04)"
```

---

### Task 9: Work section — project scenes (shipped + in-development)

**Files:**
- Create: `src/sections/ProjectScene.tsx`
- Create: `src/sections/Work.tsx`

**Interfaces:**
- Consumes: `projects` + `Project` (Task 4), `Reveal` (Task 5).
- Produces:
  - `<ProjectScene project={Project} index={number} />` — one project as a scene: image with token-driven overlay, name (Syne), status pill (`IN DEVELOPMENT` for `status==='in-development'` using `var(--accent-2)`, else `SHIPPED`), quote, tags, an expandable "Builder Journey" (4 steps: turning_point / the_struggle / what_i_learned / milestone with the `what_i_built` chips under struggle), and CTA links. **Render the Live Demo `<a>` only when `project.liveDemo` is defined**; always render the GitHub `<a>`.
  - `<Work />` — `<section id="work">` header ("Selected work") + alternating-layout list of `<ProjectScene>`.

- [ ] **Step 1: Write `src/sections/ProjectScene.tsx`**

Port the journey/expand logic from the existing `ProjectCard` in `Moi.tsx`, but: (a) all colors from tokens plus the project's own `accentColor` for per-project accents; (b) replace the year badge with a **status pill** — `project.status === 'in-development' ? 'IN DEVELOPMENT' : 'SHIPPED'`; (c) guard the Live Demo link: `{project.liveDemo && (<a href={project.liveDemo} …>Live Demo</a>)}`; (d) drop the old X-Ray/CODE overlay (no longer part of the design). Alternate image/text side based on `index % 2`. Wrap in `<Reveal>`.

- [ ] **Step 2: Write `src/sections/Work.tsx`**

`<section id="work">` with a `maxWidth: 1300` container, a Fira Code kicker `// Selected work`, an `<h2>` "Things I've built.", a one-line helper, then `projects.map((p, i) => <ProjectScene key={p.id} project={p} index={i} />)`. All colors from tokens.

- [ ] **Step 3: Verify build + visual**

Run: `npm run build` then `npm run dev`
Expected: PASS. All 5 projects render. Game Trigger / Engineering Portal / Recepta show a Live Demo button; LOCA and Profy.ai show `IN DEVELOPMENT`, a GitHub button, and **no** Live Demo button. Journey expander works.

- [ ] **Step 4: Commit**

```bash
git add src/sections/ProjectScene.tsx src/sections/Work.tsx
git commit -m "feat: add project scenes with in-development handling"
```

---

### Task 10: Contributions section (GitHub calendar)

**Files:**
- Create: `src/sections/Contributions.tsx`

**Interfaces:**
- Consumes: `react-github-calendar`, `useTheme` (Task 3), `Reveal` (Task 5).
- Produces: `<Contributions />` — `<section id="contributions">` with `<GitHubCalendar username="moi-script" />`, theme-aware colors, contained so a slow/failed fetch doesn't shift layout.

- [ ] **Step 1: Write `src/sections/Contributions.tsx`**

```tsx
import GitHubCalendar from 'react-github-calendar'
import { useTheme } from '../theme/ThemeContext'
import { Reveal } from '../components/Reveal'

const explicitTheme = {
  light: ['#e9edf5', '#b9c9ef', '#7aa0f0', '#4f7cf0', '#2f6bff'],
  dark: ['#0f1626', '#0a3a2e', '#0f7a54', '#12b374', '#00ff88'],
}

export function Contributions() {
  const { theme } = useTheme()
  return (
    <section id="contributions" style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 48px' }}>
      <Reveal>
        <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-2)', margin: '0 0 8px' }}>// Consistency, visualized</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(26px,4vw,44px)', color: 'var(--fg)', margin: '0 0 32px', letterSpacing: '-0.02em' }}>Showing up, every day.</h2>
        <div style={{ minHeight: 180, overflowX: 'auto', color: 'var(--fg-muted)' }}>
          <GitHubCalendar username="moi-script" colorScheme={theme} theme={explicitTheme} />
        </div>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 2: Verify build + visual**

Run: `npm run build` then `npm run dev`
Expected: PASS. The calendar renders `moi-script`'s squares; light theme uses the blue palette, dark uses green; toggling theme updates the palette; container scrolls horizontally on mobile with no page shift.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Contributions.tsx
git commit -m "feat: add GitHub contribution graph for moi-script"
```

---

### Task 11: About + Contact + Footer

**Files:**
- Create: `src/sections/About.tsx`
- Create: `src/sections/Contact.tsx`
- Create: `src/sections/Footer.tsx`

**Interfaces:**
- Consumes: `Reveal` (Task 5).
- Produces: `<About />` (`#about`), `<Contact onHireClick={() => void} />` (`#contact`), `<Footer />`.

- [ ] **Step 1: Write `src/sections/About.tsx`**

Port the existing About section (headline "Architecting Logic. Solving Systems.", the paragraph about NCST, the three modules, and the `analyze.js` terminal block) into `#about`, with all colors from tokens. Keep the terminal block using `var(--code-bg)` / `var(--code-fg)`. Wrap in `<Reveal>`.

- [ ] **Step 2: Write `src/sections/Contact.tsx`**

Port the existing Contact section (kicker, "Got a system to build?", the three link pills for email / GitHub / LinkedIn) into `#contact`, colors from tokens. Include a "Hire Me" button that calls `onHireClick`.

- [ ] **Step 3: Write `src/sections/Footer.tsx`**

Small footer: `Built by Moi · 2026 · Cavite, PH 🇵🇭` and a status dot, colors from tokens.

- [ ] **Step 4: Verify build + visual**

Run: `npm run build` then `npm run dev`
Expected: PASS. All three render correctly in both themes; contact links point to `nugalmoises62@gmail.com`, `github.com/moi-script`, and the LinkedIn URL.

- [ ] **Step 5: Commit**

```bash
git add src/sections/About.tsx src/sections/Contact.tsx src/sections/Footer.tsx
git commit -m "feat: add about, contact, and footer sections"
```

---

### Task 12: Compose App + retire the monolith

**Files:**
- Rewrite: `src/App.tsx`
- Delete: `src/Moi.tsx`
- Modify: `src/main.tsx` (render `<App />` if it wasn't already)

**Interfaces:**
- Consumes: all sections (Tasks 6–11), `Hire.tsx` (existing).
- Produces: the full ordered page.

- [ ] **Step 1: Rewrite `src/App.tsx`**

```tsx
import { useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { Work } from './sections/Work'
import { Contributions } from './sections/Contributions'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import HireMeModal from './Hire'

export default function App() {
  const [hireOpen, setHireOpen] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <Nav onHireClick={() => setHireOpen(true)} />
      <Hero />
      <Story />
      <Work />
      <Contributions />
      <About />
      <Contact onHireClick={() => setHireOpen(true)} />
      <Footer />
      <HireMeModal isOpen={hireOpen} onClose={() => setHireOpen(false)} />
    </div>
  )
}
```

- [ ] **Step 2: Ensure `src/main.tsx` renders `<App />`**

Confirm `main.tsx` imports and renders `<App />` (inside `<ThemeProvider>` from Task 3). If it still imports `MoiPortfolio`, switch it to `App`.

- [ ] **Step 3: Delete the old monolith**

```bash
git rm src/Moi.tsx
```

- [ ] **Step 4: Verify Hire.tsx colors**

Open `src/Hire.tsx`; if it hardcodes dark-only colors that look broken on the light theme, swap its surface/text/border colors to tokens (`var(--bg-elev)`, `var(--fg)`, `var(--border)`, `var(--accent-2)`). Keep its API (`isOpen`, `onClose`) unchanged.

- [ ] **Step 5: Verify build + lint + full visual pass**

Run: `npm run build && npm run lint`
Expected: both PASS, no unused-import or type errors (old `Moi.tsx` gone). In `npm run dev`, the whole page reads top-to-bottom: Hero → Story → Work → Contributions → About → Contact → Footer, in both themes, with the Hire modal opening from nav and contact.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/main.tsx src/Hire.tsx
git commit -m "feat: compose cinematic page and retire Moi.tsx monolith"
```

---

### Task 13: Humanize copy + final verification

**Files:**
- Modify: `src/data/projects.ts`, `src/data/story.ts`, `src/sections/Hero.tsx`, `src/sections/About.tsx`, `src/sections/Contact.tsx` (copy only)

**Interfaces:**
- Consumes: everything. No signature changes — text edits only.

- [ ] **Step 1: Run the humanizer skill over all visitor-facing copy**

Invoke the `humanizer` skill on the narration in `story.ts`, the `journey` fields in `projects.ts`, and the hero/about/contact prose. Apply its edits (remove em-dash overuse, rule-of-three, AI vocabulary, inflated phrasing) directly in those files. Keep meaning and facts identical; only the wording changes.

- [ ] **Step 2: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both PASS.

- [ ] **Step 3: Drive the site end-to-end (verify skill)**

Invoke the `verify` skill (or manually via `npm run dev`) and walk the full scroll story in both themes. Confirm the checklist from the spec §13: light↔dark across every section with no hardcoded-color bleed; reduced-motion path; mobile layout; contribution graph renders; all GitHub links correct; LOCA/Profy show `IN DEVELOPMENT` with no live-demo button; CV download works.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: humanize portfolio copy and finalize"
```

---

## Self-Review

**Spec coverage:**
- Goal / no-AI → Global Constraints + Task 12 (no chatbot anywhere). ✓
- Narrative spine Acts 00–05 → Task 7 (Hero), Task 8 (Story 01–04), Task 9 (Work incl. Frontier LOCA/Profy). ✓
- Light-first theme + dark toggle → Tasks 2, 3, 5, 6. ✓
- Componentization / retire monolith → Tasks 4–12. ✓
- Deps limited to two → Task 1. ✓
- Contribution graph `moi-script`, theme-aware → Task 10. ✓
- Accent ink + electric blue; neon green dark-only → Task 2 tokens. ✓
- Tasteful motion + reduced-motion → Tasks 2, 5, 8. ✓
- LOCA/Profy in-development, no live demo → Tasks 4, 9. ✓
- Assets copied → Task 4. ✓
- Humanize copy → Task 13. ✓
- No-flash theme init → Task 3. ✓
- Testing/verification → each task's verify step + Task 13 §13 walk. ✓

**Placeholder scan:** No TBD/TODO; every code step shows real code; ported sections name the exact source (`Moi.tsx` `ProjectCard`/nav/about/contact) and the exact transformations (tokens, status pill, liveDemo guard). ✓

**Type consistency:** `Project`/`Journey`/`Act` fields defined in Task 4 are used unchanged in Tasks 8–9; `useTheme()` returns `{theme, toggle}` (Task 3) used in Tasks 5, 6, 10; `Reveal`/`ThemeToggle` props consistent across consumers. ✓
