# LOCA — Hyperlocal Spatial Commerce Platform

> A map-first super-app for Filipino residential communities — discover nearby businesses, run errands through Pasabuy, earn from hyperlocal microtasks, and manage your HOA, all from a single live spatial interface.

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="MapLibre" src="https://img.shields.io/badge/MapLibre%20GL-5-396CB2?logo=maplibre&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-Private-lightgrey">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screens & Modules](#screens--modules)
- [Architecture](#architecture)
- [Role-Based Access Control](#role-based-access-control)
- [Nearby Business Map](#nearby-business-map)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Theming](#theming)
- [Project Status](#project-status)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [License](#license)

---

## Overview

**LOCA** is a hyperlocal spatial commerce platform built for Filipino residential subdivisions, currently targeting the **General Trias / Imus / Cavite** corridor. It gives four distinct user types — **residents**, **business owners**, **errand runners**, and **HOA administrators** — a single, map-based interface to do five things:

- **Discover** nearby businesses on a live spatial map
- **Order** errands through **Pasabuy** (the errand-runner marketplace)
- **Earn** by accepting hyperlocal gig jobs through **Microtasks**
- **Manage** community alerts, residents, and disputes through **HOA Admin**
- **Explore** businesses through an **AR camera overlay**

The strongest differentiator: **Pasabuy running on top of a live business-discovery map, inside a subdivision context** — combining a hyperlocal map, a trusted errand network, and a community layer that Grab, Facebook Marketplace, and Google Maps don't address together.

---

## Features

| Module | What it does |
|---|---|
| 🗺️ **Live Map Dashboard** | MapLibre GL map with clustered business pins, theme-aware styles, geolocation, and category color-coding |
| 🛒 **Pasabuy** | Post errands, browse the order board, place bids, accept runs, upload receipts, and track runner trips |
| 💼 **Microtasks** | Browse and claim hyperlocal gig jobs, post new tasks, track claimed work and history, in-task chat & reviews |
| 🏘️ **HOA Admin** | Community alerts & broadcasts, resident management, dispute resolution, content moderation, verification review |
| 📊 **Nearby Business Map** | Dual-mode (consumer / analytics) map with two-stage fetch, best-spot scoring, and an AI RAG insight panel |
| 🪪 **Owner Portal** | Register and manage businesses, view per-business analytics, manage incoming orders |
| 📷 **AR View** | Three.js camera viewfinder overlaying nearby business pins with a mini radar and compass |
| 💬 **Live Chat** | In-app chat with bubbles, reactions, typing indicators, and contextual cards |
| 💰 **Wallet** | Balance view, top-up, and withdrawal flows (designed for Pasabuy/microtask settlement) |
| 🔐 **Auth & RBAC** | Session-based authentication with a 5-role, stackable role-based access control system |

---

## Tech Stack

**Framework & Language**
- [Next.js 16](https://nextjs.org/) (App Router) · [React 19](https://react.dev/) · [TypeScript 5](https://www.typescriptlang.org/)

**Mapping**
- [MapLibre GL](https://maplibre.org/) · [react-map-gl](https://visgl.github.io/react-map-gl/) · [pigeon-maps](https://pigeon-maps.js.org/)

**State & Data**
- [Zustand](https://zustand-demo.pmnd.rs/) · [TanStack React Query](https://tanstack.com/query) · [Axios](https://axios-http.com/) · [socket.io-client](https://socket.io/)

**UI & Styling**
- [Tailwind CSS v4](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) · [Framer Motion](https://www.framer.com/motion/) · [lucide-react](https://lucide.dev/) / [react-icons](https://react-icons.github.io/react-icons/) · [Vaul](https://vaul.emilkowal.ski/) (drawers)

**3D / AR**
- [Three.js](https://threejs.org/) · [react-webcam](https://www.npmjs.com/package/react-webcam)

---

## Screens & Modules

The app uses Next.js **route groups** to isolate role-specific surfaces:

- `(resident)` — dashboard, map, Pasabuy, profile, settings, add-business
- `(owner)` — business management, per-business analytics, orders
- `(microtask)` — task feed, my-tasks, task detail, wallet, profiles
- `(hoa-admin)` — alerts, residents, disputes, moderation
- `(system-admin)` — user management, ID verification review
- `(auth)` / `login` — registration and login

---

## Architecture

### Frontend
A polished, mobile-first Next.js App Router frontend. Components are cleanly separated by domain (`dashboard`, `pasabuy`, `microtask`, `hoa`, `nearby-map`, `ar`, `chat`), so each module can swap mock data for real API calls without breaking the others.

### Backend (separate service)
Business/place data is served by a separate API (the only real data connection today) configured via `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:5000`. Session auth uses a `connect.sid` cookie.

### State management
- **Zustand** stores (`taskStore`, `useStore`) with derived selectors for filters and counts
- **React Query** for server-state fetching/caching
- **React Context** for `AuthContext` (session + roles) and `LocationContext` (user geo-position)

### Route protection
`middleware.ts` guards protected prefixes (`/dashboard`, `/pasabuy`, `/tasks`, `/hoa-admin`, `/settings`, `/profile`, `/wallet`, `/book`, `/jobs`) by checking for the session cookie and redirecting to `/login` when absent — with role validation layered on top in each route-group layout (defense in depth).

---

## Role-Based Access Control

LOCA ships a multi-role, **stackable** RBAC system. Roles are a TypeScript union, validated at runtime by middleware (session) and layout guards (role).

| Role | Description | Capabilities |
|---|---|---|
| `resident` | Base community member | Dashboard, profile, ID verification |
| `verified_resident` | Resident with approved ID | Same as resident + verification badge |
| `owner` | Business operator (stacks with resident) | Create/manage businesses, analytics, orders |
| `hoa_admin` | Community administrator | Approve content, resolve disputes, manage community |
| `system_admin` | Platform administrator | Approve verifications, manage users, system settings |

**Principles**
1. Roles are **stackable** — a user can be `resident` + `owner` simultaneously.
2. Verification is **orthogonal** — `verified_resident` unlocks a badge, not extra features.
3. Admin domains are **isolated** — `hoa_admin` and `system_admin` don't overlap.
4. **Middleware validates session; layouts validate role.**

The `AuthContext` exposes helpers like `hasRole`, `hasAnyRole`, `hasAllRoles`, an `activeRole`, and `switchRole` for users holding multiple roles. See [`RBAC_IMPLEMENTATION.md`](local_business_centralized_map/RBAC_IMPLEMENTATION.md) for the full reference.

---

## Nearby Business Map

The standout feature: a single database serving **two completely different users** through one map.

- **Consumer mode** — "find a place." Answers *should I go here right now?* with open/closed status, distance (haversine, computed live), rating, and price tier.
- **Analytics mode** — "scout a location." Shifts to a heatmap keyed by a composite **best-spot score**, with population density, competitor count, and foot-traffic patterns.

**Two-stage (plus analytics) fetch** keeps the map fast regardless of pin density:

```
GET /api/pins?bbox=lat1,lng1,lat2,lng2&category=all   # Stage 1 — lightweight pins (target <50ms)
GET /api/business/:id                                  # Stage 2 — detail on pin tap
GET /api/analytics/:id?radius=2000                     # Stage 3 — analytics mode only
```

**Best-spot score:**

```
best_spot_score = (population_density / competitor_count) × foot_traffic_index
```

An optional **RAG pipeline** turns nearby reviews, demographics, and competitor sentiment into a 2–3 sentence plain-language location insight. The full design lives in [`CLAUDE.md`](local_business_centralized_map/CLAUDE.md).

---

## Getting Started

### Prerequisites
- **Node.js 20+** and npm
- (Optional) the business/places backend API running on `localhost:5000`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd centralized_map/local_business_centralized_map

# Install dependencies
npm install

# Create your local env file (see Environment Variables below)
# .env.local  ->  NEXT_PUBLIC_API_URL=http://localhost:5000

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The app lives in the `local_business_centralized_map/` subdirectory. Run all npm commands from there.

---

## Project Structure

```
local_business_centralized_map/
├── app/
│   ├── (auth)/              # Registration / login
│   ├── (resident)/          # Dashboard, map, Pasabuy, profile, settings
│   ├── (owner)/             # Business management, analytics, orders
│   ├── (microtask)/         # Task feed, my-tasks, wallet, profiles
│   ├── (hoa-admin)/         # Alerts, residents, disputes, moderation
│   ├── (system-admin)/      # User management, verification review
│   ├── context/             # AuthContext, LocationContext
│   ├── hooks/               # useNearbyPlaces, useOsmShops
│   ├── store/               # Zustand stores (taskStore, useStore)
│   └── types/               # auth, business, osm, verification types
├── components/
│   ├── nearby-map/          # Consumer + analytics dual-mode map
│   ├── pasabuy/             # Order board, runner flow, shop picker
│   ├── microtask/           # Task cards, detail, forms, maps
│   ├── hoa/                 # Alerts, disputes, moderation, verification
│   ├── ar/                  # AR viewfinder, pins, radar, compass
│   ├── chat/                # Live chat UI
│   └── ui/                  # shadcn/ui primitives
├── lib/                     # api, geo, gps, socket, utils, theming
├── hooks/                   # Pasabuy wallet, runner trip, nearby orders
├── types/                   # nearby-business data models
├── mocks/                   # Mock data fixtures
└── middleware.ts            # Session-based route protection
```

---

## Environment Variables

Create a `.env.local` file in `local_business_centralized_map/`:

```bash
# Base URL of the business/places backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> `.env.local` is git-ignored — never commit secrets.

---

## Available Scripts

Run from `local_business_centralized_map/`:

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## Theming

LOCA ships a multi-theme design system powered by `next-themes` and CSS custom properties:

> **dark · light · ember · neon · dusk · arctic**

Map styles are theme-aware and switch automatically with the active theme.

---

## Project Status

> **LOCA is a fully-designed, fully-interactive prototype** — every screen exists and every flow is navigable. Most data is currently **mocked**; the one real connection is the business/places API (`/api/places`).

| Area | Status |
|---|---|
| UI / screens / navigation | ✅ Complete |
| Business pins on map | 🟡 Real API (local-only) |
| Auth & RBAC | ✅ Implemented (session + 5 roles) |
| Pasabuy / Microtask / Wallet transactions | 🔴 Mocked |
| Live chat / presence / stats | 🔴 Static seed data |

See the executive product review in [`local_business_centralized_map/README.md`](local_business_centralized_map/README.md) for a full mock-data audit.

---

## Roadmap

The guiding principle: **make the core loop real before adding surface area.**

> **Open map → find a business → place a Pasabuy order → runner accepts → order completes → both sides notified and paid.**

- **Phase 0 — Make the foundation real:** deploy the backend, real sessions, single source of truth for business data, strip console logs, add error boundaries.
- **Phase 1 — Close the core loop:** wire Pasabuy accept/bid, "Order via Pasabuy" from map pins, connect the wallet to transaction fees, real-time chat, order-status notifications.
- **Phase 2 — Build the habit layer:** 3-step onboarding, business claim/verify, HOA alerts on the map, push-notification triggers, real stats & presence.
- **Phase 3 — Expand:** business subscription tier, runner reputation, B2B analytics portal, HOA as a standalone subdomain, re-enable AR.

---

## Documentation

| Document | Contents |
|---|---|
| [`CLAUDE.md`](local_business_centralized_map/CLAUDE.md) | Nearby Business Map feature plan — data model, API stages, dual-mode UX, RAG pipeline |
| [`RBAC_IMPLEMENTATION.md`](local_business_centralized_map/RBAC_IMPLEMENTATION.md) | Full RBAC reference and checklist |
| [`TESTING_RBAC.md`](local_business_centralized_map/TESTING_RBAC.md) | RBAC test scenarios |
| [`TEST_RBAC_QUICK_START.md`](local_business_centralized_map/TEST_RBAC_QUICK_START.md) | Quick-start RBAC testing guide |
| [`VERIFICATION_TESTING.md`](local_business_centralized_map/VERIFICATION_TESTING.md) | Verification flow testing |

---

## License

Private / proprietary. All rights reserved.

---

<p align="center"><em>Part of the HyperLoca / LOCA platform · Authored by <a href="https://github.com/lowkeyCodee">lowkeyCodee</a></em></p>
