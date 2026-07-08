import { useState } from 'react'
import { Reveal } from '../components/Reveal'

const modules = [
  {
    label: 'The Architect',
    icon: '⬡',
    desc: 'I design scalable full-stack systems, thinking about how data flows from a MongoDB schema to a React frontend before writing a single line of UI.',
  },
  {
    label: 'The Logic',
    icon: '⌘',
    desc: '2+ years of breaking and fixing things. My foundation spans Node.js, Express, and everything between — built through real DSA-driven projects.',
  },
  {
    label: 'The Solver',
    icon: '◈',
    desc: "I build to remove friction. Whether it's OCR reading receipts or an AI assistant, the goal is always: make the technology work for the person efficiently, not some showy stuff.",
  },
]

export function About() {
  const [activeModule, setActiveModule] = useState(0)

  return (
    <section id="about" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 48px' }}>
        <Reveal>
          <div
            style={{
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 24,
              padding: 52,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
            }}
          >
            <p
              style={{
                margin: '0 0 8px',
                fontFamily: "'Fira Code', monospace",
                fontSize: 11,
                color: 'var(--accent-2)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              // About the Developer
            </p>
            <h2
              style={{
                margin: '0 0 18px',
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(24px, 3.5vw, 42px)',
                fontWeight: 900,
                color: 'var(--fg)',
                letterSpacing: '-0.02em',
              }}
            >
              Architecting Logic.
              <br />
              Solving Systems.
            </h2>
            <p
              style={{
                margin: '0 0 44px',
                color: 'var(--fg-muted)',
                fontSize: 15,
                lineHeight: 1.75,
                maxWidth: 640,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Computer Engineering student from National College of Science and Technology, who views software
              through the lens of an engineer. With a foundation in Node.js and a passion for AI-driven automation, I
              specialize in building{' '}
              <em style={{ color: 'var(--accent-2)', fontStyle: 'normal' }}>smart systems</em> — from full-stack
              budget trackers with OCR to real-time learning portals. I believe we're all part of a larger ecosystem,
              helping each other solve problems.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 32 }}>
              {modules.map((mod, i) => {
                const active = activeModule === i
                return (
                  <div
                    key={mod.label}
                    onMouseEnter={() => setActiveModule(i)}
                    style={{
                      padding: 26,
                      background: active ? 'var(--bg)' : 'transparent',
                      border: `1px solid ${active ? 'var(--accent-2)' : 'var(--border)'}`,
                      borderRadius: 14,
                      cursor: 'default',
                      transition: 'all 0.3s',
                      flex: 1,
                      minWidth: 180,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        marginBottom: 12,
                        filter: active ? 'drop-shadow(0 0 10px var(--accent-2))' : 'none',
                        transition: 'filter 0.3s',
                      }}
                    >
                      {mod.icon}
                    </div>
                    <h4
                      style={{
                        margin: '0 0 8px',
                        fontFamily: "'Fira Code', monospace",
                        fontSize: 11,
                        fontWeight: 600,
                        color: active ? 'var(--accent-2)' : 'var(--fg-faint)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {mod.label}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: 'var(--fg-muted)',
                        lineHeight: 1.6,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {mod.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            <div
              style={{
                padding: '22px 26px',
                background: 'var(--code-bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontFamily: "'Fira Code', monospace",
                fontSize: 12,
                lineHeight: 2,
                color: 'var(--code-fg)',
              }}
            >
              <div>
                <span style={{ opacity: 0.5 }}>$ </span>
                <span>node analyze.js --mode deep</span>
              </div>
              <div>
                <span style={{ opacity: 0.5 }}>→ </span>
                <span style={{ opacity: 0.75 }}>Experience: </span>
                <span>3+ years</span>
                <span style={{ opacity: 0.75 }}> Node.js · React · Javascript</span>
              </div>
              <div>
                <span style={{ opacity: 0.5 }}>→ </span>
                <span style={{ opacity: 0.75 }}>Currently: </span>
                <span>Computer Engineering</span>
                <span style={{ opacity: 0.75 }}> Project · AI + OCR + IOT</span>
              </div>
              <div>
                <span style={{ opacity: 0.5 }}>→ </span>
                <span style={{ opacity: 0.75 }}>Mindset: </span>
                <span>"Consistency is everything. Humility is the edge."</span>
              </div>
              <div>
                <span style={{ opacity: 0.5 }}>→ </span>
                <span style={{ opacity: 0.75 }}>Status: </span>
                <span>◉ Open to internships &amp; freelance</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
