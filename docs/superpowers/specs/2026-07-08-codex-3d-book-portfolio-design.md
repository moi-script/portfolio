# The Codex — Portfolio as a 3D Fantasy Book

**Date:** 2026-07-08
**Status:** Approved design, ready for implementation planning
**Branch:** redesign/cinematic-portfolio

## Summary

Redesign the entire portfolio as a single interactive 3D book ("The Codex"),
rendered in WebGL. The whole site becomes the book: every section is a page
spread. Pages bend like real paper as the user scrolls (continuous scrub), and
settle when scrolling stops. The book has a cartoon-fantasy look — warm
parchment pages, wood-and-gold binding, gold corner caps — matching
`reference_designs/book3d reference.jpg`. It floats in a dark, candlelit "room"
so the existing dark theme and neon accents still have a home (glows on the gold
and page edges).

Interactive content (project links, contact links, live GitHub calendar) stays
fully usable via a **hybrid** approach: the currently-open spread shows real HTML
laid flat on the page; only the page being turned becomes a bending textured
mesh. On phones and for `prefers-reduced-motion` users, the WebGL book is
skipped entirely in favor of stacked parchment cards with identical content.

## Goals

- Turn the existing formal dark portfolio into a memorable, distinctive 3D book.
- Preserve all current content and interactivity (links, CV download, live
  GitHub contribution calendar, project details).
- Keep it fast and accessible: graceful non-WebGL fallback on mobile and for
  reduced-motion users.
- Reuse existing data (`src/data/projects.ts`, `src/data/story.ts`) unchanged —
  only the presentation layer changes.

## Non-goals

- No new content/copywriting beyond page-fitting adjustments.
- No backend, no contact form submission (contact stays as mailto/links, same as
  today).
- No literal desk/library 3D scene (rejected in favor of the candlelit room).
- Not shipping realistic paper physics/cloth simulation — a vertex-shader bend
  is sufficient.

## Design decisions (locked)

| Decision | Choice |
|---|---|
| Book scope | Whole site is the book |
| Visual style | Literal cartoon fantasy book (parchment, wood, gold corners) |
| Rendering | Real WebGL — `three` + `@react-three/fiber` + `@react-three/drei` |
| Content on pages | Hybrid: interactive flat HTML on resting spread; bending texture only during a turn |
| Profile photo | Circular gold-ring medallion on the first intro spread (author-portrait style) |
| Turn feel | Continuous scrub tied to scroll; settles when scrolling stops |
| Work section | Scrollable chapter inside one Work spread (5 projects scroll vertically) |
| Backdrop | Dark candlelit room — warm vignette + faint floating dust |
| Fallback | Mobile (< ~820px) and reduced-motion → stacked parchment cards, no WebGL |

## Page map

The book is ~8 turnable spreads:

| # | Spread | Content (source) |
|---|---|---|
| 0 | **Cover** (closed) | Wood + gold book, embossed "Moi — The Codex", "open to begin" hint |
| 1 | **Intro** | Left: circular profile medallion (gold ring, `profile_pic_5.png`). Right: "Hi, I'm Moi", tagline, stack line, CTAs (View work / Download CV) |
| 2 | **Activity ledger** | Live GitHub contribution calendar (`react-github-calendar`), styled as a ledger |
| 3 | **Story A** | Acts 01–02 from `data/story.ts` |
| 4 | **Story B** | Acts 03–04 from `data/story.ts` |
| 5 | **Work** | Chapter header + vertically scrollable list of 5 project cards (`data/projects.ts`): image, name, year/subject, quote, journey highlights, GitHub + Live links |
| 6 | **About** | Architect / Logic / Solver modules + facts table + "open to internships" |
| 7 | **Contact** | "Got a system to build?" + Hire Me (mailto) + email/GitHub/LinkedIn links |
| 8 | **Back cover** | Footer info, close |

## Architecture

New presentation layer wrapping existing content/data. Existing section
components are refactored into "page content" components that can render both
inside the 3D `<Html>` overlay and inside the fallback cards (same JSX, no 3D
assumptions in the content itself).

```
App
├── useBookMode()            // decides: webgl book vs fallback cards
│                            //   (viewport width + prefers-reduced-motion)
├── <BookCanvas> (webgl)     // R3F <Canvas>
│   ├── Lights + candlelit vignette + dust (drei)
│   ├── <Book>               // group; holds pages, spine, gold corners, cover
│   │   └── <Page> × N       // subdivided plane w/ vertex-bend shader
│   │       ├── front/back parchment material
│   │       └── <Html transform> page content (only on resting/open spread)
│   ├── ScrollControls       // scroll → page-turn progress
│   └── <NavOverlay>         // fixed HTML nav; links map section → page index
└── <FallbackBook> (no webgl)
    └── stacked <ParchmentCard> per spread (same content components)
```

### Components / units

- **`useBookMode()`** — hook returning `'webgl' | 'cards'`. WebGL only when
  viewport ≥ ~820px AND not `prefers-reduced-motion`. Re-evaluates on resize.
  *Depends on:* window matchMedia. *Used by:* `App`.

- **`<BookCanvas>`** — sets up the R3F `<Canvas>`, camera, lighting, backdrop
  (vignette + dust), and mounts `<Book>` + scroll + nav. *Depends on:* r3f,
  drei. *Used by:* `App` (webgl mode).

- **`<Book>`** — the book model group: cover, spine, gold corner caps, and the
  stack of `<Page>`s. Owns page-turn state derived from scroll progress. Maps a
  continuous `progress` (0 → N) to per-page `turn` uniforms. *Depends on:*
  `<Page>`, scroll progress. *Interface:* `progress: number`, `pages: PageDef[]`.

- **`<Page>`** — one leaf. A `PlaneGeometry` with enough width segments to bend
  smoothly. A custom `ShaderMaterial` (or `onBeforeCompile` patch) applies a
  `turn` uniform (0 = flat right, 1 = flat left) that rotates+curves the plane
  around the spine. Renders front and back faces with parchment textures. When
  the page is the open/resting spread, mounts interactive content via drei
  `<Html transform occlude>`; during a turn, hides HTML and shows the textured
  bend. *Interface:* `turn: number`, `frontContent`, `backContent`,
  `isResting: boolean`.

- **Page content components** — refactor of existing sections into presentation-
  neutral pieces reused by both webgl `<Html>` and fallback cards:
  `IntroContent` (+ circular `ProfileMedallion`), `LedgerContent` (GitHub
  calendar), `StoryContent`, `WorkContent` (scrollable project list),
  `AboutContent`, `ContactContent`. *Depends on:* `data/*`. *Used by:* `<Page>`
  and `<ParchmentCard>`.

- **`<ProfileMedallion>`** — circular framed photo: `profile_pic_5.png` inside a
  gold ring with a soft inner glow, on a warm circular background. Reused on
  intro spread (and available for cover later if wanted).

- **`<NavOverlay>`** — fixed HTML nav (adapt existing `Nav.tsx`). Each link maps
  a section to a target page index and animates scroll to it. Also holds the
  theme toggle.

- **`<FallbackBook>` / `<ParchmentCard>`** — non-WebGL path. Vertical stack of
  warm parchment-styled cards, one per spread, using the same content
  components. No bend, fully interactive, fast.

## Data flow

- Scroll position → `progress` (0..N pages). `<Book>` distributes `progress` to
  each `<Page>`'s `turn` uniform (page i turns as progress crosses i→i+1).
- Only the spread whose pages are fully settled (fractional part ≈ 0) is marked
  `isResting` and mounts interactive `<Html>` content; turning pages render as
  textures. This is the hybrid interaction contract.
- Nav link click → compute target page index → animate scroll offset → book
  turns to that spread.
- Existing `data/projects.ts` and `data/story.ts` consumed directly by content
  components. Theme tokens (`theme/tokens.css`) still drive the room/accent
  colors; new warm parchment/gold values added as tokens.

## Rendering the bend (technical note)

`<Page>` uses a `PlaneGeometry(width, height, W, 1)` with `W` ~ 20 width
segments. A vertex shader rotates each vertex around the spine (x = 0 edge) by an
angle that scales with `turn`, plus a small sinusoidal curl so the free edge
lifts and curves rather than staying rigid. Normals recomputed for lighting so
the bend catches the candlelight. Phase 1 proves this on a single page before
scaling to the full stack.

## Textures / assets

- Parchment page texture: generated (canvas noise) or a bundled seamless
  parchment image; warm tan.
- Wood + gold binding and corner caps: can reuse/derive from
  `reference_designs/book3d reference.jpg` as the cover/binding chrome, or model
  simple beveled geometry with gold material. Decision deferred to plan (start
  with textured planes from the reference for speed).
- Profile: `src/assets/profile_pic_5.png` (already black-background cutout, good
  for a circular medallion).

## Error handling & resilience

- WebGL unavailable / context-lost → fall back to `<FallbackBook>` (treat like
  cards mode).
- GitHub calendar fetch failure → existing library handles; show empty ledger
  frame gracefully.
- `<Html transform>` registration drift on resize → recompute on resize; nav
  jump re-settles scroll.
- Keep an escape hatch: a "flat view" toggle that switches to fallback cards even
  on desktop (helps users who dislike the 3D and aids debugging).

## Accessibility

- `prefers-reduced-motion` → fallback cards, no page-turn animation.
- All content lives in real DOM in both modes (drei `<Html>` renders real DOM),
  so links and text are reachable; ensure headings/landmarks preserved.
- Nav is keyboard-usable and jumps between spreads.

## Testing / verification

- Manual: page-turn scrub feels smooth at 60fps on desktop; links/calendar work
  on resting spreads; nav jumps land on correct spreads.
- Fallback: resize below ~820px and set reduced-motion → cards render with all
  content, no WebGL, no console errors.
- Build: `npm run build` (tsc + vite) passes; `npm run lint` clean.
- Cross-check content parity: every current section's content appears in the book
  and in the fallback.

## Phased implementation (build order)

1. **Scene + one bending page** — R3F canvas, candlelit backdrop, a single
   `<Page>` with the vertex-bend shader driven by scroll scrub. Prove the look
   and the scroll mapping.
2. **Full multi-page book** — stack of pages, cover, spine, gold corners,
   parchment textures; scroll turns through all ~8 spreads (placeholder content).
3. **Hybrid content + nav** — refactor sections into content components; mount
   interactive `<Html>` on resting spreads; wire `<NavOverlay>` section→page
   mapping; Work chapter scroll-within-spread.
4. **Fallback + polish** — `useBookMode`, `<FallbackBook>`/`<ParchmentCard>`,
   reduced-motion, flat-view toggle; lighting/gold/dust polish; performance pass;
   optional page-turn sound.

Each phase should be working and reviewed before starting the next.

## Dependencies to add

- `three`
- `@react-three/fiber`
- `@react-three/drei`

(Existing `framer-motion` stays for HTML-side transitions and the fallback.)

## Risks

- Page-bend shader tuning and normals/lighting can be fiddly.
- `<Html transform>` alignment with a curved/rotated page during the settle
  transition may need care (hide during turn, show only when settled mitigates
  this).
- Bundle size grows (three.js). Acceptable given the goal; fallback keeps mobile
  light since the book code can be lazy-loaded/code-split.
- Fitting dense content (project journeys) onto a page — Work chapter scroll
  addresses this; other spreads may need concise trims.
