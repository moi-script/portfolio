import { acts } from '../data/story'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Timeline() {
  return (
    <section id="journey" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="How I got here" title="My Journey" />
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        <div aria-hidden style={{
          position: 'absolute', left: 7, top: 6, bottom: 6, width: 2,
          background: 'linear-gradient(var(--accent), transparent)',
        }} />
        {acts.map((act, i) => (
          <Reveal key={act.id} delay={i * 0.08}>
            <div style={{ position: 'relative', paddingBottom: 36 }}>
              <span aria-hidden style={{
                position: 'absolute', left: -32, top: 4, width: 16, height: 16, borderRadius: '50%',
                background: 'var(--accent)', border: '3px solid var(--bg)',
              }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: 'var(--accent)' }}>{act.index}</span>
                <h3 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--fg)' }}>{act.title}</h3>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--fg-faint)' }}>{act.kicker}</span>
              </div>
              <p style={{ margin: '8px 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: 'var(--fg-muted)' }}>{act.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
