import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function About() {
  return (
    <Section id="about" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Who I am" title="About Me" />
      <Reveal>
        <p style={{
          margin: 0, maxWidth: 720, fontFamily: "'DM Sans', sans-serif",
          fontSize: 19, lineHeight: 1.7, color: 'var(--fg-muted)',
        }}>
          I'm a Computer Engineering student who builds full-stack web apps, and lately
          most of my time goes into adding AI features like receipt OCR and RAG.
        </p>
      </Reveal>
    </Section>
  )
}
