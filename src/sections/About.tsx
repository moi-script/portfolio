import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const STATS = [
  { value: '5', label: 'Projects shipped & in dev' },
  { value: 'MERN', label: 'Primary stack' },
  { value: 'AI', label: 'RAG · OCR · Agents' },
]

export function About() {
  return (
    <section id="about" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Who I am" title="About Me" />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 40 }} className="about-grid">
        <Reveal>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8, color: 'var(--fg-muted)' }}>
            <p style={{ marginTop: 0 }}>
              I'm a Computer Engineering student who builds web apps end to end. I used to
              start with the frontend and suffer for it, rewriting everything once the data
              didn't fit. Now I design the database first and the rest goes a lot smoother.
            </p>
            <p style={{ marginBottom: 0 }}>
              Most of my time right now goes into AI features: receipt OCR, RAG, a
              paper-trading agent. Next I want to get into embedded systems and IoT, so the
              hardware half of my degree finally gets some use.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ display: 'grid', gap: 14 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{
                background: 'var(--bg-elev)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '18px 20px',
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, color: 'var(--accent)' }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--fg-faint)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
