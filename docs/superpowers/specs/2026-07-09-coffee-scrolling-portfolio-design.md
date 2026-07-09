# Coffee Scrolling Portfolio — Design Spec

**Date:** 2026-07-09
**Author:** John Moises (with Claude)
**Status:** Approved for planning
**Supersedes:** The 3D WebGL "cinematic book" experience (`src/book/`), which is abandoned.

## Summary

Replace the 3D book portfolio with a conventional, polished single-page scrolling
portfolio for a full-stack + AI developer. Layout and mood follow the provided
reference (`reference_designs/maxresdefault.jpg` — the "Jacob Aiden" hero), but with
a **coffee/espresso color theme** instead of the reference's blue. Real project and
story data already in the repo is reused; no placeholder project content.

## Goals

- Single scrolling page that answers a recruiter's four questions: who are you, what
  can you build, how do you build it, why hire you.
- Reference-faithful hero: split layout, name + title + intro + CTA buttons + social
  row on the left, coffee-tinted portrait on the right, framed in a rounded dark card.
- Coffee palette in **both** a dark (espresso) and light (latte) theme, toggleable.
- Tasteful scroll-reveal motion; `prefers-reduced-motion` respected.

## Non-Goals (YAGNI)

- No 3D/WebGL, no `three`, `@react-three/*` usage in the new site.
- No testimonials, blog, certificates, or separate hardware section (can come later).
- No routing — single page with anchor smooth-scroll only.
- No CMS/backend. Content is static in `src/data/*`.

## Approach

**Chosen: Polished animated single-page** (Approach A). One scrolling page composed of
section components, `framer-motion` scroll-reveal via the existing `Reveal` component,
a sticky nav with smooth-scroll and active-section highlighting, and a light/dark
theme toggle. Rejected: minimal-static (undersells the work) and multi-route (overkill,
breaks the single-scroll recruiter flow, adds a router dependency).

## Architecture

### Teardown
- Delete `src/book/` entirely (all components, content, shaders, tests, hooks).
- Remove `three`, `@react-three/fiber`, `@react-three/drei` from `package.json`
  dependencies (no longer used).
- Rewrite `src/App.tsx` to compose the new sections + nav + footer.

### Kept and reused
- `src/data/projects.ts` — 5 real projects (unchanged).
- `src/data/story.ts` — 4-act learning journey (unchanged, drives Timeline).
- `src/assets/*` — project screenshots + `profile_pic_1.png` for the hero.
- `src/components/Reveal.tsx` — scroll-reveal wrapper (reused as-is).
- `src/theme/ThemeContext.tsx` + `ThemeToggle.tsx` — light/dark toggle (reused).
- `src/theme/tokens.css` — **retuned** to the coffee palette (see below).
- Fonts: Syne (display), DM Sans (body), Fira Code (mono) — kept.
- `react-github-calendar` — drives the GitHub section.

### New files
```
src/
  App.tsx                 (rewritten: composes everything)
  data/skills.ts          (new: categorized tech stack)
  components/
    Nav.tsx               (sticky top nav; smooth-scroll; active-section highlight)
    Footer.tsx            (© 2026 John Moises + socials)
    SectionHeading.tsx    (shared section title/kicker)
  sections/
    Hero.tsx
    About.tsx
    Skills.tsx
    Projects.tsx
    ProjectCard.tsx       (one card; used by Projects)
    GitHub.tsx
    Timeline.tsx
    Contact.tsx
  lib/
    useActiveSection.ts   (IntersectionObserver-based; testable)
```

### Data flow
- Static imports: sections import from `src/data/*` and `src/assets/*` directly.
- No global state beyond the existing `ThemeContext`.
- `Nav` reads the active section id from `useActiveSection` (observes each `<section id>`).

## Coffee Palette (`tokens.css`)

Retune the existing CSS custom properties. Accent replaces the reference blue with
warm caramel; kept identical across themes for brand continuity.

**Dark (espresso) — default cinematic look:**
- `--bg`: `#0f0a06` (near-black roasted brown)
- `--bg-elev`: `#1a120b` (raised card surface)
- `--fg`: `#f0e6d8` (latte foam)
- `--fg-muted`: `#b7a790`
- `--fg-faint`: `#7a6b57`
- `--border`: `rgba(240, 230, 216, 0.08)`
- `--accent`: `#c8874f` (caramel — buttons, links, active nav)
- `--accent-2`: `#e0a668` (lighter caramel for hovers/glows)
- `--shadow`: `0 20px 60px rgba(0, 0, 0, 0.5)`

**Light (latte):**
- `--bg`: `#f5ede1` (cream)
- `--bg-elev`: `#fffaf3`
- `--fg`: `#2b1d12` (espresso ink)
- `--fg-muted`: `#6b5844`
- `--fg-faint`: `#a3927c`
- `--border`: `rgba(43, 29, 18, 0.10)`
- `--accent`: `#a5673a` (slightly deeper caramel for contrast on cream)
- `--accent-2`: `#c8874f`
- `--shadow`: `0 20px 60px rgba(43, 29, 18, 0.08)`

The obsolete book palette tokens (`--parchment`, `--ink`, `--wood`, `--room-bg`, etc.)
are removed. The on-image scrim tokens are kept (project cards still overlay photos).

## Sections

### 1. Hero (`#home`)
Reference-faithful, inside a large rounded dark card (`--bg-elev`) with a soft accent
glow. Two-column on desktop, stacked on mobile.
- **Left:** greeting "Hi, I'm **John Moises**" (Syne, large); subtitle
  "Full-Stack & AI Developer" (accent color); one-line intro; button row —
  **View Projects** (filled accent, scrolls to `#projects`), **Let's Talk** (outline,
  scrolls to `#contact`), **Download Resume** (text/ghost link to `/resume.pdf`);
  social row — GitHub, LinkedIn, email icons.
- **Right:** `profile_pic_1.png` treated with a **coffee duotone** (CSS
  `filter: sepia() saturate() hue-rotate()` + blend, or a duotone overlay) so it reads
  espresso-brown, with a radial accent glow behind it.

### 2. About (`#about`)
Short bio: Computer Engineering student, full-stack + AI developer, currently exploring
embedded systems / AI + IoT. 2–3 sentences, `Reveal`-animated. Small stat/keyword row
optional (e.g., "5 shipped projects", "MERN + AI").

### 3. Skills (`#skills`)
Five categorized groups from new `src/data/skills.ts`:
- **Frontend:** React, TypeScript, JavaScript, HTML, CSS, Tailwind, Next.js
- **Backend:** Node.js, Express, Spring Boot, REST, JWT Auth, WebSockets
- **Database:** MongoDB, PostgreSQL, Redis, Firebase
- **DevOps/Tools:** Git, GitHub, Docker, Vercel, Railway
- **Languages:** C++, C, Python, JavaScript, TypeScript

Rendered as labeled chip groups. (Final list confirmed against real projects; editable.)

### 4. Projects (`#projects`)
The 5 real projects from `projects.ts` as animated cards (`ProjectCard.tsx`):
screenshot, name, `year` + `subject`, status badge (shipped / in-development), tag
chips, the project `quote`, and links — **Live Demo** (if `liveDemo` present) +
**GitHub**. Hover lift. Grid on desktop, single column on mobile.

### 5. GitHub Activity (`#github`)
`react-github-calendar` for username `moi-script`, themed with coffee accent colors
for the contribution levels. Short caption.

### 6. Timeline (`#journey`)
The 4 acts from `story.ts` (`index`, `title`, `kicker`, `body`) as a vertical timeline
with a caramel connector line and `Reveal`-staggered entries.

### 7. Contact (`#contact`)
Heading + short line, then links: email (`nugalmoises62@gmail.com`),
GitHub (`github.com/moi-script`), LinkedIn (placeholder URL — clearly marked TODO for
the user to replace), and a **Download Resume** button (`/resume.pdf` — placeholder file
the user drops into `public/`).

### Footer
Simple: "© 2026 John Moises" + repeat social icons.

## Navigation

- `Nav.tsx`: sticky top bar. Left: "Moises." wordmark. Right: anchor links
  (Home, About, Skills, Projects, Journey, Contact) + `ThemeToggle`.
- Smooth-scroll to section anchors (CSS `scroll-behavior: smooth`, already in tokens).
- Active link highlighted via `useActiveSection` (IntersectionObserver over the
  `<section id>` elements). Mobile: condensed / hamburger menu.

## Motion

- Section content wrapped in `Reveal` (existing fade + slide-up, `once: true`).
- Card hover: subtle translateY lift + shadow.
- Hero portrait: gentle entrance; optional slow glow pulse.
- All motion gated by `prefers-reduced-motion` (already handled in `Reveal` and
  `tokens.css`).

## Testing

- `src/lib/useActiveSection.ts`: pure-ish logic testable with a mocked
  IntersectionObserver (Vitest + jsdom already configured).
- `src/data/skills.ts`: a trivial shape test to guard the structure.
- Delete obsolete `src/book/*.test.ts` files with the book teardown.
- `npm run build` (tsc + vite) and `npm run lint` must pass.

## Content details (confirmed)

- **Display name:** John Moises
- **Title:** Full-Stack & AI Developer
- **GitHub:** github.com/moi-script
- **Email:** nugalmoises62@gmail.com
- **LinkedIn:** placeholder (user to provide)
- **Resume:** `public/resume.pdf` placeholder (user to provide)
- **Hero photo:** `src/assets/profile_pic_1.png`, coffee duotone
- **Theme:** light (latte) + dark (espresso) toggle, dark as the signature look

## Open items for the user (non-blocking)

- Provide LinkedIn URL and `resume.pdf`.
- Confirm the Skills list matches what you want shown.
