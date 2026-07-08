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
    id: 'loca',
    name: 'LOCA',
    status: 'in-development',
    year: '2026 · In Development',
    subject: 'Hyperlocal Spatial Commerce Platform',
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
