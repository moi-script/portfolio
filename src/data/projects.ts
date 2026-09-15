import receptaImg from '../assets/recepta.png'
import triggerImg from '../assets/trigger_game.png'
import portalImg from '../assets/engr_portal.png'
import locaImg from '../assets/loca.png'
import profyImg from '../assets/profy.png'
import mechatronicsImg from '../assets/mechatronics.png'
import manixImg from '../assets/manix.png'
import rfidImg from '../assets/ncst_rfid.png'
import traceworksImg from '../assets/traceworks.png'

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
  /** One-line pitch shown on the home page. */
  summary: string
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
    summary: 'Browser reaction game with a real-time loop and Web Audio sound. 1st place, CpE Week.',
    tags: ['HTML', 'CSS', 'JavaScript', 'DOM', 'Web Audio API'],
    accentColor: '#00ff88',
    quote: 'C++ taught me how computers think. JavaScript showed me code could be beautiful.',
    github: 'https://github.com/moi-script/Trigger_Game_Project',
    liveDemo: 'https://trigger-game-project.vercel.app/',
    image: triggerImg,
    journey: {
      turning_point: "Coming from the rigid, low-level world of C++, the DOM felt like moving from a calculator to a canvas. Web development was alive in a way I didn't expect, and this project was where that clicked for me.",
      the_struggle: "JavaScript was completely new territory. Event listeners, DOM manipulation, browser APIs, none of it exists in C++. Writing my first real-time game loop with sound effects through the Web Audio API, on a deadline, was the hardest I'd worked up to that point.",
      what_i_built: ['DOM Events', 'Web Audio API', 'Game Loop', 'CSS Animations', 'Score System', 'Sound Integration'],
      what_i_learned: "JavaScript is more interesting than I thought. Seeing HTML, CSS, and JS combine into something that responds to you with sound and motion was the moment I understood why people love front-end development. My algorithmic thinking got a lot sharper from it too.",
      milestone: "1st place, Computer Engineering Week. It wasn't just a certificate. It told me my algorithmic thinking could solve real, interactive problems under a deadline, and that curiosity turned into a passion I still carry today.",
    },
  },
  {
    id: 'engineering-portal',
    name: 'Engineering Portal',
    status: 'shipped',
    year: '2nd Year',
    subject: 'Data Structures & Algorithms',
    summary: 'School portal for admins, teachers, and students with real-time WebSocket chat.',
    tags: ['React', 'Node.js', 'Spring Boot', 'WebSocket', 'MongoDB', 'Charts'],
    accentColor: '#7c3aed',
    quote: 'I started frontend first. I suffered miserably. Now I always start with the schema.',
    github: 'https://github.com/moi-script/engineering_portal',
    liveDemo: 'https://engineering-portal-front.vercel.app/',
    image: portalImg,
    journey: {
      turning_point: "If Game Trigger was my honeymoon phase, the Engineering Portal was my trial by fire. This project forced me to grow up as a developer, pulling me away from leaning on AI and into React and system design at the same time.",
      the_struggle: "I built it frontend, then backend, then database. That was backwards. I ended up in constant, painful refactoring cycles because my frontend didn't match the data I actually needed. The multi-role system (Admin, Teacher, Student) and real-time chat made it ten times more complex.",
      what_i_built: ['Multi-role Auth', 'Real-time Chat', 'WebSocket', 'Progress Charts', 'Admin Dashboard', 'DB Schema Design'],
      what_i_learned: "Always start with the schema. Schema-first design saves you weeks of pain later. Real-time data over WebSocket was the most satisfying thing I picked up here; watching messages appear without a page refresh still felt like magic.",
      milestone: "Watching the database schema finally click with the UI after weeks of refactoring, then submitting a system where admins, teachers, and students could all interact in real time. I owe that mostly to just not giving up on it.",
    },
  },
  {
    id: 'recepta',
    name: 'Recepta',
    status: 'shipped',
    year: '2026–Present',
    subject: 'Personal SaaS Project',
    summary: 'AI budget tracker: snap a receipt and Azure OCR pulls out the items and prices.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Azure AI', 'RAG', 'OCR'],
    accentColor: '#00d4ff',
    quote: 'This is where I realized software is a global collaboration.',
    github: 'https://github.com/moi-script/YourCeipt',
    liveDemo: 'https://recepta-phi.vercel.app/',
    image: receptaImg,
    journey: {
      turning_point: "Recepta is my best project to date, and I'm planning to market it as my first SaaS. It's the project that made me realize how vast the software world actually is. It started as a budget tracker but grew into something closer to an AI-driven financial assistant.",
      the_struggle: "This took a long time to build: planning, designing, database architecture, AI integration, RAG, OCR, and third-party APIs. Each layer taught me something new. The hardest part was getting all these systems to actually talk to each other without breaking.",
      what_i_built: ['Azure OCR', 'RAG System', 'AI Smart Text', 'Vector DB', 'Full MERN Stack', 'Third-party APIs'],
      what_i_learned: "Building Recepta made me humble. Every tool I used, from open source libraries to paid APIs, is the result of real people putting in real work. In the software world, you're never really building alone.",
      milestone: "Pointing a camera at a receipt and watching Azure AI pull out prices, dates, and items into structured data faster than I could read them, then seeing the budget update instantly. That's when I knew full-stack development was my path.",
    },
  },
  {
    id: 'mechatronic-trainer',
    name: 'Mechatronic Trainer',
    status: 'shipped',
    year: '2026',
    subject: 'Lab Trainer Board Simulator',
    summary: 'Browser replica of the mechatronics lab board: wire relays, lamps, and buttons with a live circuit solver.',
    tags: ['Next.js 15', 'TypeScript', 'SVG', 'Express', 'MongoDB', 'Tailwind v4'],
    accentColor: '#22c55e',
    quote: 'Practise the wiring without waiting for the bench.',
    github: 'https://github.com/moi-script/mechatronics_device',
    liveDemo: 'https://mechatronicdevice.vercel.app/',
    image: mechatronicsImg,
    journey: {
      turning_point: "Lab time on the real mechatronics trainer is limited, so I rebuilt the board in the browser. The inventory matches the physical panel exactly: breaker, power supply, push buttons, toggle switches, lamps, and relays.",
      the_struggle: "Making leads behave like real banana plugs: stacking into towers, refusing female-to-female or looping chains, and re-solving the whole circuit on every interaction. Keeping that logic out of React was the key decision.",
      what_i_built: ['Net Solver', 'SVG Wiring Board', 'Stacking Leads', 'Undo / Redo', 'Save & Share Links', 'Practice Timer'],
      what_i_learned: "Separating a pure, dependency-free simulation package from the UI makes the hard part testable on its own. The web app became a thin consumer of the solver.",
      milestone: "Classmates can wire a full relay circuit, see faults flagged live, and share a read-only link to their board, all without touching the lab bench.",
    },
  },
  {
    id: 'ncst-rfid',
    name: 'NCST RFID System',
    status: 'shipped',
    year: '2026',
    subject: 'Centralized Campus Access & Attendance',
    summary: 'One RFID card per person at every campus gate: scans, attendance, vehicles, and an admin console.',
    tags: ['Next.js 16', 'TypeScript', 'Express', 'MongoDB', 'JWT', 'Docker'],
    accentColor: '#1d4ed8',
    quote: 'One card, every gate.',
    github: 'https://github.com/moi-script/shared_access_rfid',
    liveDemo: 'https://ncst-rfid.vercel.app/login',
    image: rfidImg,
    journey: {
      turning_point: "A centralized RFID system for NCST where a single card works at every person and vehicle gate, with registration, attendance logging, and reporting behind it.",
      the_struggle: "Real gates are messy: missed exit taps, expiring vehicle passes, rate limits, and several roles (superadmin, registrar, staff, students) that each see different things from one login form.",
      what_i_built: ['Gate Scan API', 'Attendance Logs', 'Vehicle Passes', 'Role-based Console', 'CSV Bulk Import', 'Refresh Token Rotation'],
      what_i_learned: "Security details matter in production: short-lived access tokens, rotated httpOnly refresh cookies, Zod validation, and making sure the login never reveals which accounts are privileged.",
      milestone: "A deployed backend on Render and admin console on Vercel, with live gate status and scan activity for the whole campus.",
    },
  },
  {
    id: 'manix',
    name: 'Manix',
    status: 'shipped',
    year: '2026',
    subject: 'Manhwa Reader',
    summary: 'Fast, ad-free manhwa reader built on the MangaDex API with a caching image proxy.',
    tags: ['Next.js', 'TypeScript', 'Express', 'MongoDB', 'MangaDex API'],
    accentColor: '#facc15',
    quote: 'No ads, no paywalls, just reading.',
    github: 'https://github.com/moi-script/manix',
    liveDemo: 'https://readmanix.vercel.app/',
    image: manixImg,
    journey: {
      turning_point: "I wanted a clean, fast place to read manhwa without ads, so I built one on top of the MangaDex API while following its rules to the letter.",
      the_struggle: "Every request and image goes through my own server: rate limiting against MangaDex, reporting MangaDex@Home node fetches, caching images at the edge, and honoring scanlation group removal requests.",
      what_i_built: ['Browse & Search', 'Library & History', 'Image Proxy + Cache', 'Rate Limiting', 'Accounts', 'Group Blocklist'],
      what_i_learned: "Building on someone else's API means respecting their terms as a first-class feature, and caching strategy (immutable covers, short-lived chapter pages) decides how fast the site feels.",
      milestone: "Thousands of titles browsable in a snappy reader, deployed and credited properly to MangaDex and the scanlation groups.",
    },
  },
  {
    id: 'traceworks',
    name: 'TraceWorks',
    status: 'shipped',
    year: '2026',
    subject: 'PCB Pen-Plotter Pipeline',
    summary: 'Upload a KiCad board or image, route it to G-code, preview the toolpath, and plot it over USB to GRBL.',
    tags: ['Next.js 15', 'FastAPI', 'Python', 'GRBL', 'MongoDB', 'WebSocket'],
    accentColor: '#c2410c',
    quote: 'Plot a real PCB from your browser.',
    github: 'https://github.com/moi-script/pcb_ui',
    image: traceworksImg,
    journey: {
      turning_point: "TraceWorks takes a single-layer KiCad board, works out a pen plot that doesn't waste motion, and sends it straight to an Arduino plotter, so you don't need a separate G-code sender.",
      the_struggle: "A browser tab can't open a serial port, so a local FastAPI backend owns the COM link, streams G-code under GRBL's character-counting flow control, and pushes position and progress back over WebSocket.",
      what_i_built: ['KiCad Parser', 'G-code Router', 'Image Tracer', 'Toolpath Preview', 'Jog & Zero Controls', 'Windows Installer'],
      what_i_learned: "Hardware is honest: GRBL acknowledges a line when it's queued, not drawn, so the UI shows both progress and real position and names them for what they are.",
      milestone: "A board going from KiCad file to pen on copper with 92% less pen travel, shipped as an installable Windows app with a hardware simulator for testing.",
    },
  },
  {
    id: 'loca',
    name: 'LOCA',
    status: 'in-development',
    year: '2026 · In Development',
    subject: 'Hyperlocal Spatial Commerce Platform',
    summary: 'Map-first super-app for nearby businesses, errands, microtasks, and HOA admin.',
    tags: ['Next.js 16', 'React 19', 'MapLibre GL', 'Tailwind v4', 'Zustand', 'Three.js', 'Socket.io'],
    accentColor: '#2f6bff',
    quote: 'A whole city, mapped: Pasabuy running on top of a live business map.',
    github: 'https://github.com/moi-script/centralized_business_map',
    image: locaImg,
    journey: {
      turning_point: "LOCA is a map-first super-app for Filipino residential communities. Discover nearby businesses, run errands through Pasabuy, earn from hyperlocal microtasks, and manage your HOA, all from one live spatial interface.",
      the_struggle: "Serving two completely different users from one database through a single map: consumers asking 'should I go here right now?' and location scouts asking 'is this a good spot to open?' Keeping the map fast at high pin density meant a two-stage fetch and a best-spot scoring model.",
      what_i_built: ['Live MapLibre Map', 'Pasabuy Errand Market', 'Microtasks', 'HOA Admin', 'AR View (Three.js)', '5-role RBAC'],
      what_i_learned: "How to design a real spatial product: theme-aware map styles, clustered pins, haversine distance computed live, and a RAG pipeline that turns nearby reviews and demographics into a plain-language location insight.",
      milestone: "A fully designed, fully interactive prototype where every screen exists and every flow is navigable. Four user types (residents, owners, runners, HOA admins) share one map. Right now I'm focused on making the core loop real before adding more on top of it.",
    },
  },
  {
    id: 'profy',
    name: 'Profy.ai',
    status: 'in-development',
    year: '2026 · In Development',
    subject: 'Autonomous AI Crypto Trading Terminal',
    summary: 'AI crypto trading terminal with live market data, an analysis agent, and paper trading.',
    tags: ['Next.js', 'Express', 'Python', 'MongoDB Atlas', 'Redis', 'Celery', 'Docker', 'Socket.io'],
    accentColor: '#00d4ff',
    quote: 'Trade with the clarity of a machine.',
    github: 'https://github.com/moi-script/crypt_dashboard',
    image: profyImg,
    journey: {
      turning_point: "Profy.ai is an autonomous AI crypto trading terminal: live market data, a multi-framework analysis agent, a paper-trading engine with full position lifecycle, and a real-time dashboard, built as a monorepo with Next.js, Express, and Python.",
      the_struggle: "Getting three runtimes to work as one product: a Next.js frontend, an Express API, and a Python analysis worker, glued together with MongoDB Atlas, Redis, Celery, and Socket.io, all inside Docker so a session can be spun up from scratch every time.",
      what_i_built: ['Live Market Data', 'AI Analysis Agent', 'Paper Trading Engine', 'Position Lifecycle', 'Real-time Dashboard', 'Celery Workers'],
      what_i_learned: "How production trading infrastructure actually fits together: real-time streaming over Socket.io, caching hot data in Redis, and running heavy AI analysis off the request path with Celery so the terminal stays responsive.",
      milestone: "A working terminal that streams real-time markets, runs AI-powered insights off the main thread, and simulates a full trade lifecycle end to end. It's the closest I've come to building something a serious trader could actually use.",
    },
  },
]
