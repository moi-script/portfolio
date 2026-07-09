# Spider-Switch Two-Persona Hero — Design Spec

**Date:** 2026-07-09
**Author:** John Moises (with Claude)
**Status:** Approved for planning
**Builds on:** The coffee-themed scrolling portfolio (`docs/superpowers/specs/2026-07-09-coffee-scrolling-portfolio-design.md`).

## Summary

Replace the hero's static portrait area and the theme toggle-as-primary-switch with
an interactive, physics-driven **spider pull-switch** and a **two-persona hero** that
morphs between a calm "day" workspace and a cyberpunk-leaning "night" workspace. The
spider pull toggles the site's existing light/dark theme; every other section follows
automatically because they already read the shared `data-theme` tokens. The rest of the
portfolio is unchanged.

## Goals

- A believable, delightful spider "ceiling-pull" interaction: idle sway, hover reaction,
  elastic drag, spring snap-back with oscillation, and theme toggle on a successful pull.
- A cinematic day↔night morph of the hero's right-side scene (lighting, colors,
  particles, workspace props) rather than an instant swap.
- Keep the whole site cohesive: personas are built on the existing coffee palette
  (day = latte light, night = espresso dark) with persona accents layered only in the hero.
- Fully accessible and reduced-motion safe; 60fps (transform/opacity animation only).

## Non-Goals (YAGNI)

- No new global theme state. The spider calls the existing `useTheme().toggle()`.
- No painted/illustrated character art or literal cyberpunk room. The scene is a stylized
  CSS/SVG vignette; the portrait's *lighting/treatment* changes per persona, not its clothing.
- No Tailwind. The project uses inline styles + CSS custom properties; keep that.
- No changes to About/Skills/Projects/GitHub/Timeline/Contact beyond following the theme.
- No 3D/WebGL, no new heavy dependencies. Uses `framer-motion` (already installed).

## Architecture

### Theme wiring
- Source of truth stays `src/theme/ThemeContext.tsx` (`theme: 'light' | 'dark'`, `toggle()`).
- `light` = **Day persona**, `dark` = **Night persona**. No mapping layer, no new context.
- The nav keeps the existing small `ThemeToggle` so the theme is switchable after the
  hero scrolls away.
- Persona-specific styling in the hero is driven by reading `theme` from `useTheme()`,
  not by new tokens elsewhere.

### New / changed files
```
src/
  components/
    SpiderSwitch.tsx    (new) hanging spider + web; physics; toggles theme
  sections/
    PersonaScene.tsx    (new) morphing day/night workspace vignette + portrait
    Hero.tsx            (rewrite) composes left content + PersonaScene + SpiderSwitch
  index.css             (add) persona/scene keyframes, transitions, responsive rules
```
Unchanged: `ThemeContext.tsx`, `ThemeToggle.tsx`, `Nav.tsx`, all other sections.

## Component: SpiderSwitch

**Purpose:** A pull-switch that toggles the theme, positioned in the hero's top-right.

**Interface:** `SpiderSwitch({ onToggle }: { onToggle: () => void })` — `onToggle` is
`toggle` from `useTheme()`. Self-contained; owns its own motion state.

**Structure (SVG):**
- A web line (SVG `<line>`/`<path>`) from a fixed anchor near the top edge down to the spider.
- A spider body (SVG group: body, eyes, 8 legs) at the web's end.
- Rendered inside a positioned container; the whole thing is a focusable control.

**Motion state (framer-motion):**
- `y` = `useMotionValue(0)`; `ySpring = useSpring(y, { stiffness, damping })` drives the
  spider's vertical offset. The web's end-Y follows `ySpring` so the strand stretches.
- Idle: a looped keyframe animation adds a small horizontal sway (pendulum) and a subtle
  breathing scale; the anchor drifts slightly. Runs only when not dragging/reduced-motion.

**Interactions:**
- **Idle:** gentle sway + breathing.
- **Hover:** container `cursor: pointer`; a brief web "vibration" (small quick x oscillation)
  and a tiny leg twitch.
- **Drag:** `drag="y"`, `dragConstraints={{ top: 0, bottom: MAX_PULL }}`,
  `dragElastic`. During drag the web stretches with the spider.
- **Release:** spring back to `y: 0` with low damping so it oscillates and bounces before
  settling. If the pull distance at release `>= PULL_THRESHOLD` (or drag velocity is high),
  call `onToggle()` once as it snaps back.
- **Click / keyboard:** the control is a real `<button>` (or `role="button"` + `tabIndex=0`)
  with `aria-label="Pull the spider to switch between day and night"`. Click, Enter, or Space
  runs a short scripted pull-and-release animation and calls `onToggle()`. Works without a drag.

**Guards:**
- Debounce so a single pull toggles exactly once (a `didToggle` ref cleared on drag start).
- `useReducedMotion()`: when true, skip idle loops and drag physics; render a static spider
  that toggles on click/Enter/Space with no animation.

**Constants (named, defined in the component):**
`MAX_PULL` (e.g. 120px), `PULL_THRESHOLD` (e.g. 60px), spring config for snap-back.

## Component: PersonaScene

**Purpose:** The hero's right side. A stylized workspace vignette that cross-fades between
day and night, wrapping the existing portrait.

**Interface:** `PersonaScene()` — reads `theme` from `useTheme()` internally.

**Portrait:** reuse `src/assets/profile_pic_portfolio.png` with the current coffee-duotone
`filter`. The filter/glow shifts per persona: day = brighter, slightly cooler, soft light
glow; night = darker, warmer core with a cyan/magenta RGB rim glow.

**Day scene (light):** bright desk surface, a laptop, a small potted plant, a coffee mug,
soft daylight glow, a cool subtle accent, slow-drifting dust motes. Calm, minimal, geometric.

**Night scene (dark):** darker desk, a triple-monitor silhouette with terminal/code-editor
glow, cyan/magenta RGB underglow, faint scanlines, drifting particles. Moody, premium.

**Morph:** the two scene layers are keyed on `theme` and cross-faded with `AnimatePresence`
(fade + slight blur + short scale). On switch, a brief particle burst and a lighting fade
sell the "room transforms" feel. Portrait stays mounted; only its treatment transitions.

**Performance:** animate `opacity`, `transform`, `filter` only — never layout properties.
Particles are a small fixed count of absolutely-positioned motion elements, not per-frame DOM
churn. Decorative layers are `aria-hidden`.

## Section: Hero (rewrite)

- Layout unchanged in spirit: two-column grid (`.hero-grid`), left = content, right =
  `PersonaScene`. `SpiderSwitch` is absolutely positioned in the hero card's top-right,
  above the scene, receiving `toggle` from `useTheme()`.
- Left content (copy unchanged): greeting "Hi, I'm John Moises", "Full-Stack Developer",
  the description, CTA buttons (View Projects / Let's Talk / Download Resume), social row.
  Staggered entrance via existing `Reveal`.
- The hero card background gets a persona-aware wash (day: soft light gradient; night:
  deep gradient with faint RGB), transitioned smoothly on theme change.

## Accessibility

- SpiderSwitch is keyboard-operable (Tab to focus, Enter/Space to toggle) with a visible
  focus ring and a descriptive `aria-label`; state announced via `aria-pressed` reflecting
  night = pressed (or an `aria-label` that names the current/next persona).
- The nav `ThemeToggle` remains as a conventional, always-reachable alternative.
- All decorative scene/web/particle elements are `aria-hidden`.
- `prefers-reduced-motion`: no idle loops, no drag physics, no particle bursts; theme still
  toggles instantly on activation. Handled via `useReducedMotion()` and the existing
  `@media (prefers-reduced-motion)` CSS.

## Responsive

- Desktop: spider hangs in the hero card's top-right; full scene on the right column.
- Mobile (`.hero-grid` stacks, <860px): the scene simplifies (fewer props, no triple-monitor
  clutter) and the spider relocates to a reachable top-right of the stacked card so it stays
  tappable. Portrait framing keeps the existing narrow-viewport fixes.

## Testing

- Pure logic is thin here; the value is visual/interaction. Add a lightweight test for the
  pull-decision helper: extract `shouldToggle(pullDistance, velocity, threshold): boolean`
  into a pure function and unit-test its boundaries (below threshold = false, at/above = true,
  high velocity = true). (Vitest + jsdom already configured.)
- Keep existing tests green; `npm run build` and `npm run lint` must pass.
- Interaction/visual acceptance (physics feel, morph, 60fps) is a manual browser check by the
  user.

## Risks / Notes

- The spider physics feel is subjective and needs live tuning of spring/threshold constants;
  the plan should expose them as named constants for easy adjustment.
- Cross-fading two full scenes plus particles must stay on the compositor (opacity/transform)
  to hold 60fps; avoid animating `box-shadow`/`background-position` on large layers.
- The coded scene is intentionally stylized/geometric, not illustrated. This is a known,
  accepted limitation from brainstorming.
