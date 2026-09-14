# Portfolio

A personal portfolio site built with React, TypeScript, and Vite — featuring a cinematic hero, animated section reveals, a live GitHub contribution calendar, light/dark theming, and a unique-visitor counter.

## Features

- **Cinematic hero** with a persona scene and social links
- **Unique-visitor counter** — an eye-icon view count powered by the free [Abacus](https://abacus.jasoncameron.dev/) service; each device increments the global count exactly once
- **GitHub calendar** — contribution graph read from the GitHub profile by `scripts/fetch-contributions.mjs` (runs before every build and daily via GitHub Actions), drawn with `react-activity-calendar`
- **Animated reveals** — scroll-triggered motion with `framer-motion`
- **Light / dark theme** toggle
- **Sections** — About, Skills, Projects, Timeline, and Contact
- Fully responsive, no backend required

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/) for dev server and builds
- [Framer Motion](https://www.framer.com/motion/) for animation
- [react-icons](https://react-icons.github.io/react-icons/) and [react-activity-calendar](https://github.com/grubersjoe/react-activity-calendar)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests
- [ESLint](https://eslint.org/) for linting

## Getting Started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm test` | Run the test suite once with Vitest |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── App.tsx            # Root app + layout
├── main.tsx           # Entry point
├── components/        # Reusable UI (Nav, Footer, ThemeToggle, ViewCount, …)
├── sections/          # Page sections (Hero, About, Skills, Projects, …)
├── data/              # Content data
├── lib/               # Helpers/utilities
├── theme/             # Theming
└── assets/            # Images and static assets
```

## License

Private project — all rights reserved.
