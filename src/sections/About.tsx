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
    desc: '2+ years of breaking and fixing things. My foundation is Node.js and Express, built through real DSA-driven projects rather than tutorials.',
  },
  {
    label: 'The Solver',
    icon: '◈',
    desc: "I build to remove friction. Whether it's OCR reading receipts or an AI assistant, the goal is the same: make the technology work for the person using it, not just look impressive in a demo.",
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
                margin: '0 0 10px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--fg-faint)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              About
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
              Computer Engineering student at National College of Science and Technology, and I tend to approach
              software the way an engineer approaches a system. With a foundation in Node.js and an interest in
              AI-driven automation, I build{' '}
              <em style={{ color: 'var(--accent-2)', fontStyle: 'normal' }}>smart systems</em>, from full-stack
              budget trackers with OCR to real-time learning portals. Most of what I know, I learned from other
              people's open-source work, so I try to build things worth sharing back.
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
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: active ? 'var(--accent-2)' : 'var(--fg)',
                        letterSpacing: '0.02em',
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
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 0,
                border: '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {[
                { label: 'Experience', value: '3+ years — Node.js · React · JavaScript' },
                { label: 'Currently', value: 'Computer Engineering project · AI + OCR + IoT' },
                { label: 'Mindset', value: 'Consistency is everything. Humility is the edge.' },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px 20px',
                    padding: '16px 22px',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      minWidth: 110,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-faint)',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 15,
                      color: 'var(--fg-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '16px 22px',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 8px #22c55e88',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--fg)',
                  }}
                >
                  Open to internships &amp; freelance
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
