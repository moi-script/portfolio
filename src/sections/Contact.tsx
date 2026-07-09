import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const GITHUB = 'https://github.com/moi-script'
const EMAIL = 'nugalmoises62@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace
const RESUME = '/Moises_Nugal_CV_Polished.docx' // current CV

const LINKS = [
  { label: 'Email', href: `mailto:${EMAIL}`, value: EMAIL },
  { label: 'GitHub', href: GITHUB, value: 'github.com/moi-script' },
  { label: 'LinkedIn', href: LINKEDIN, value: 'Connect with me' },
]

export function Contact() {
  return (
    <Section id="contact" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Why hire me" title="Let's Build Something" />
      <Reveal>
        <p style={{ marginTop: 0, maxWidth: 560, fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.7, color: 'var(--fg-muted)' }}>
          I'm looking for internships, and I'm happy to talk freelance too. If you're
          building something and think I can help, send me an email.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 24 }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target={l.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" style={{
              background: 'var(--bg-elev)', border: '1px solid var(--border)', borderRadius: 14,
              padding: '18px 20px', textDecoration: 'none', display: 'block',
            }}>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l.label}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'var(--fg)', marginTop: 6 }}>{l.value}</div>
            </a>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.18}>
        <a href={RESUME} download style={{
          display: 'inline-block', marginTop: 24, padding: '13px 26px', borderRadius: 10,
          background: 'var(--accent)', color: '#1a120b', fontFamily: "'DM Sans', sans-serif",
          fontSize: 15, fontWeight: 600, textDecoration: 'none',
        }}>Download Resume</a>
      </Reveal>
    </Section>
  )
}
