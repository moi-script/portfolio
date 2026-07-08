# Portfolio Redesign — "Build Log": a cinematic scroll story

**Date:** 2026-07-08
**Author:** Moi (lowkeyCodee / moi-script)
**Status:** Approved concept — pending spec review

---

## 1. Goal

Replace the current dashboard-style portfolio with a **completely new**, cinematic,
storytelling-driven site. The visitor scrolls through the arc of how Moi became an
engineer; the projects are the plot points. Same honest, terminal-rooted personality,
but **editorial, spacious, and light-first**.

Explicitly **no AI / no chatbot** — that idea was dropped.

Built using the **huashu-design** skill for visual direction and cinematic execution,
with all narration copy passed through the **humanizer** skill so it reads human, not AI.

## 2. Non-goals (YAGNI)

- No AI chatbot, no LLM, no backend, no serverless functions.
- No CMS — project/story content is hardcoded in typed data files.
- No live-demo links for LOCA and Profy.ai (not deployed). GitHub links only.
- No new routing/pages — single-page scroll experience.
- No unrelated refactors beyond breaking up the existing monolith.

## 3. Confirmed decisions

| Decision | Choice |
|---|---|
| Chatbot / AI | **Removed entirely** |
| Redesign scope | **Full rebuild** using huashu-design (cinematic storytelling) |
| Default theme | **Light**, with a manual **dark** toggle |
| Projects featured | **All 5** (Game Trigger, Engineering Portal, Recepta, LOCA, Profy.ai) |
| LOCA / Profy.ai | Shown as **`IN DEVELOPMENT`** — GitHub links, no live demo |
| GitHub calendar username | **`moi-script`** via `react-github-calendar` |
| Accent color | **Deep ink + a single electric blue**; neon green reserved for dark mode only |
| Motion intensity | **Tasteful** — pinned scenes + scrubbed reveals, scrollbar never hijacked |
| Copy | Run through **humanizer** skill |

## 4. Narrative spine (the whole site, top to bottom)

| Act | Scene | Content |
|---|---|---|
| 00 | **Cold open** (Hero) | Name, one line of identity, quiet animated grid/candlestick motif. Light by default. CTA: View work / Download CV. |
| 01 | **The Foundation** | C++ — "how computers actually think." Sets tone. (From existing timeline copy.) |
| 02 | **The Spark** | Game Trigger — 1st place CompEng Week, the moment code felt alive. |
| 03 | **The Trial** | Engineering Portal — schema-first lesson, real-time multi-role system. |
| 04 | **The Ascent** | Recepta — first SaaS, AI/OCR/RAG, MERN. |
| 05 | **The Frontier** | LOCA + Profy.ai side by side, badged `IN DEVELOPMENT`. Pulled from READMEs. |
| — | **Proof of work** | `<GitHubCalendar username="moi-script" />` framed as "consistency, visualized." |
| — | **The Engineer** (About) | About copy + the terminal `analyze.js` block (kept — it's good). |
| — | **Contact** | Hire Me modal (reuse `Hire.tsx`) + email / GitHub / LinkedIn links. |

Acts 01–04 reuse the existing hand-written "Builder Journey" content as the actual
narration — each project becomes a **scene with its story**, not a card in a grid.

## 5. Project data

### Existing (kept, content already written)
- **Game Trigger** — 1st Year, OOP. `github.com/moi-script/Trigger_Game_Project`, live demo exists.
- **Engineering Portal** — 2nd Year, DSA. `github.com/moi-script/engineering_portal`, live demo exists.
- **Recepta** — 2026–Present, SaaS. `github.com/moi-script/YourCeipt`, live demo exists.

### New (IN DEVELOPMENT — from READMEs)
- **LOCA** — Hyperlocal spatial commerce super-app for Filipino subdivisions.
  Map-first (MapLibre GL), Pasabuy errand marketplace, microtasks, HOA admin, AR view.
  Stack: Next.js 16, React 19, TS 5, MapLibre GL, Tailwind v4, Zustand, React Query, Three.js.
  Repo: `github.com/moi-script/centralized_business_map`. **No live demo.**
- **Profy.ai (Crypt Dashboard)** — Autonomous AI crypto trading terminal.
  Live market data, multi-framework analysis agent, paper-trading engine, real-time dashboard.
  Monorepo: Next.js + Express + Python. Stack: MongoDB Atlas, Redis, OpenRouter/DeepSeek/
  HuggingFace, Celery, Docker, Socket.io.
  Repo: `github.com/moi-script/crypt_dashboard`. **No live demo.**

Each project record: `name, status ('shipped' | 'in-development'), year, subject, tags[],
accentColor, quote, journey{...}, github, liveDemo?, image?`.

## 6. Theme system

- `ThemeContext` + `ThemeProvider` exposing `{ theme, toggle }`, persisted to `localStorage`.
- Theme applied via `data-theme="light" | "dark"` on `<html>`/root, driving **CSS custom
  properties**: `--bg`, `--bg-elev`, `--fg`, `--fg-muted`, `--border`, `--accent`,
  `--accent-2`, `--code`, etc.
- **Light** is the initial default (no system-preference following — explicit product choice).
- All components read from variables. **Remove hardcoded `#04070e` / neon-green literals**
  from layout; neon green becomes a dark-mode-only accent value.
- Toggle control lives in the nav; animated sun/moon.

## 7. Architecture / componentization

Current `src/Moi.tsx` is a ~1,400-line monolith. Break into focused units:

```
src/
  main.tsx                # wraps <App/> in <ThemeProvider/>
  App.tsx                 # composition root: renders Nav + sections in order
  theme/
    ThemeContext.tsx      # context + provider + localStorage
    tokens.css            # :root[data-theme=...] custom properties, fonts, keyframes
  components/
    Nav.tsx               # logo, links, theme toggle, mobile menu (from existing nav)
    ThemeToggle.tsx
    Reveal.tsx            # framer-motion scroll-reveal wrapper
    Hire.tsx              # reused as-is
  sections/
    Hero.tsx              # Act 00 cold open
    StoryAct.tsx          # reusable pinned/scrubbed act scene (Acts 01–04)
    Frontier.tsx          # Act 05 — LOCA + Profy.ai in-development cards
    Contributions.tsx     # react-github-calendar, theme-aware colors
    About.tsx             # engineer + analyze.js terminal block
    Contact.tsx           # links + Hire modal trigger
    Footer.tsx
  data/
    projects.ts           # all 5 typed project records
    story.ts              # act narration (foundation→now)
  assets/                 # existing images + add LOCA.png, Crypto.png
```

Each unit has one purpose, is independently understandable, and communicates via typed props.

## 8. Motion (tasteful, framer-motion)

- Scroll-reveal via a `Reveal` wrapper (opacity + small translate on enter viewport).
- Act scenes use light **pinning / scrubbed** transitions (sticky section + progress-driven
  opacity/position), but **the native scrollbar is never hijacked** — no scroll-jacking,
  no forced snap. Respects `prefers-reduced-motion` (reveals collapse to instant).
- Hero motif: subtle animated grid + faint candlestick line (CSS/canvas-light), theme-aware.

## 9. Dependencies

Add only:
- `react-github-calendar`
- `framer-motion`

Keep: React 19, Vite, TS. No other additions.

## 10. GitHub contribution graph

- `<GitHubCalendar username="moi-script" />` in the Contributions section.
- Theme-aware color scheme (light block palette in light mode, dark in dark mode) via the
  library's `theme`/`colorScheme` props driven by current theme.
- Graceful when the GitHub API is slow/unavailable (library shows its own loading; wrap in a
  bounded container so layout doesn't jump).

## 11. Assets

- Copy `newProjectsPic/LOCA.png` and `newProjectsPic/Crypto.png` into `src/assets/`
  for the Frontier cards.
- Keep existing project images.

## 12. Error / edge handling

- Theme toggle before hydration: apply stored theme via an inline pre-paint step to avoid a
  light→dark flash.
- Contribution graph fetch failure: contained, non-blocking, no layout shift.
- `prefers-reduced-motion`: disable pinning/scrub, keep content fully readable.
- Mobile: acts stack vertically, pinning relaxes, nav collapses to existing hamburger pattern.

## 13. Testing / verification

- `npm run build` (tsc + vite) passes clean.
- `npm run lint` passes.
- Manual: light↔dark toggle across every section; no hardcoded-color bleed; reduced-motion
  path; mobile layout; contribution graph renders for `moi-script`; all GitHub links correct;
  LOCA/Profy show `IN DEVELOPMENT` and have no live-demo button; CV download works.
- Drive the built site (verify skill) to confirm the scroll story reads end-to-end.

## 14. Success criteria

- A first-time visitor understands Moi's arc (C++ → now) by scrolling once.
- Light-first, both themes first-class, no color bleed.
- All 5 projects present; 2 new ones clearly in-development.
- Copy reads human (humanizer pass), not templated.
- No AI/chatbot anywhere. Clean build + lint.
