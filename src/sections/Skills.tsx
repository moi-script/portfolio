import { skillGroups } from '../data/skills'
import { skillIcons } from '../data/skillIcons'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Skills() {
  return (
    <Section id="skills" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
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
                {group.items.map((item) => {
                  const icon = skillIcons[item]
                  return (
                    <span key={item} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '6px 12px', borderRadius: 999, fontFamily: "'Fira Code', monospace",
                      fontSize: 13, color: 'var(--fg-muted)', background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                      border: '1px solid var(--border)',
                    }}>
                      {icon && <icon.Icon size={15} color={icon.color ?? 'var(--fg)'} aria-hidden />}
                      {item}
                    </span>
                  )
                })}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
