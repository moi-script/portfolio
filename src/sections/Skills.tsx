import { skillGroups } from '../data/skills'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Skills() {
  return (
    <section id="skills" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="How I build" title="Skills & Tools" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.06}>
            <div style={{
              background: 'var(--bg-elev)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 24, height: '100%',
            }}>
              <h3 style={{
                margin: '0 0 16px', fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 18, color: 'var(--fg)',
              }}>{group.category}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {group.items.map((item) => (
                  <span key={item} style={{
                    padding: '6px 12px', borderRadius: 999, fontFamily: "'Fira Code', monospace",
                    fontSize: 13, color: 'var(--fg-muted)', background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                    border: '1px solid var(--border)',
                  }}>{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
