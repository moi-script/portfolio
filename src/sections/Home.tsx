import type { CSSProperties } from 'react'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'
import { ThemeToggle } from '../components/ThemeToggle'
import { ViewCount } from '../components/ViewCount'
import { ProjectDeck } from './ProjectDeck'
import { TechStack } from './TechStack'

const RESUME = '/Moises_Nugal_CV_Polished.docx' // current CV
const GITHUB = 'https://github.com/moi-script'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace
const EMAIL = 'nugalmoises62@gmail.com'

// Strongest work first.
const PROJECT_ORDER = ['recepta', 'profy', 'loca', 'engineering-portal', 'game-trigger']
const orderedProjects = PROJECT_ORDER
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is Project => Boolean(p))

const sans = "'DM Sans', sans-serif"

const btn: CSSProperties = {
  padding: '10px 18px', borderRadius: 10, fontFamily: sans, fontSize: 14,
  fontWeight: 600, textDecoration: 'none', display: 'inline-block',
}

export function Home() {
  return (
    <div className="home">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--fg)' }}>
          Moises<span style={{ color: 'var(--accent)' }}>.</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ViewCount />
          <ThemeToggle />
        </div>
      </header>

      <div className="home-grid">
        {/* Left: who I am + tech stack */}
        <section className="home-intro">
          <div>
            <h1 style={{
              margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 900,
              fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05, color: 'var(--fg)',
            }}>John Moises</h1>
            <p style={{ margin: '8px 0 0', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--accent)' }}>
              Full-Stack Developer
            </p>
            <p style={{ margin: '12px 0 0', maxWidth: 440, fontFamily: sans, fontSize: 15, lineHeight: 1.6, color: 'var(--fg-muted)' }}>
              Computer Engineering student building full-stack apps with AI features.
              Open to internships and freelance work.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
              <a href={`mailto:${EMAIL}`} style={{ ...btn, background: 'var(--accent)', color: '#1a120b' }}>Email me</a>
              <a href={RESUME} download style={{ ...btn, color: 'var(--fg)', border: '1px solid var(--border)' }}>Resume</a>
              <a href={GITHUB} target="_blank" rel="noreferrer" style={{ ...btn, color: 'var(--fg)', border: '1px solid var(--border)' }}>GitHub</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ ...btn, color: 'var(--fg)', border: '1px solid var(--border)' }}>LinkedIn</a>
            </div>
          </div>

          <TechStack />

          <a href="#about" className="home-more">More about me ↓</a>
        </section>

        {/* Right: project card deck */}
        <ProjectDeck projects={orderedProjects} />
      </div>
    </div>
  )
}
