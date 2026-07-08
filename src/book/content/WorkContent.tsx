import { projects } from '../../data/projects'

export function WorkContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Selected Work
      </p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--ink)', margin: '0 0 14px' }}>
        Things I&rsquo;ve built.
      </h2>
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {projects.map((p) => (
          <div key={p.id} style={{ border: '1px solid var(--parchment-edge)', borderRadius: 10, padding: 14, background: 'rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--ink)', margin: 0 }}>{p.name}</h3>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.year} · {p.subject}</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.55, color: 'var(--ink-muted)', margin: '0 0 8px' }}>{p.journey.turning_point}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              {p.tags.slice(0, 6).map((t) => (
                <span key={t} style={{ fontFamily: "'Fira Code', monospace", fontSize: 10, color: 'var(--gold-deep)' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>GitHub ↗</a>
              {p.liveDemo && <a href={p.liveDemo} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--gold-deep)' }}>Live ↗</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
