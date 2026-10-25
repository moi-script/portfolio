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
          I'm a Computer Engineering student. I started with full-stack web apps and AI
          features like receipt OCR and RAG, and now I'm working closer to the physical
          world: computer vision models in Roboflow, ESP32 sensor boards, and the
          mechatronics projects that tie them together.
        </p>
      </Reveal>
    </Section>
  )
}
