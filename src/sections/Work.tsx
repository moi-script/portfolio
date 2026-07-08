import { projects } from '../data/projects'
import { ProjectScene } from './ProjectScene'
import { Reveal } from '../components/Reveal'

export function Work() {
  return (
    <section id="work" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 48px' }}>
        <Reveal>
          <p
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--accent-2)',
              margin: '0 0 8px',
            }}
          >
            // Selected work
          </p>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(26px,4vw,44px)',
              color: 'var(--fg)',
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Things I've built.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: 'var(--fg-muted)',
              margin: 0,
            }}
          >
            Five projects, five turning points — from a first game jam win to systems still in the making.
          </p>
        </Reveal>

        {projects.map((p, i) => (
          <ProjectScene key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
