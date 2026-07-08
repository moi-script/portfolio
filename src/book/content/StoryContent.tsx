import { acts } from '../../data/story'

export function StoryContent({ part }: { part: 1 | 2 }) {
  const slice = part === 1 ? acts.slice(0, 2) : acts.slice(2, 4)
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Background {part === 1 ? '· I' : '· II'}
      </p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--ink)', margin: '0 0 20px' }}>
        From C++ to shipping systems.
      </h2>
      {slice.map((act) => (
        <div key={act.id} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--gold-deep)' }}>{act.index}</span>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: 'var(--ink)', margin: 0 }}>{act.title}</h3>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{act.kicker}</span>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-muted)', margin: 0 }}>{act.body}</p>
        </div>
      ))}
    </div>
  )
}
