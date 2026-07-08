import { Reveal } from '../components/Reveal'

const links = [
  { label: 'nugalmoises62@gmail.com', icon: '◎', href: 'mailto:nugalmoises62@gmail.com' },
  { label: 'github.com/moi-script', icon: '⌥', href: 'https://github.com/moi-script' },
  { label: 'linkedin.com/in/moi', icon: '⊞', href: 'https://www.linkedin.com/in/moises-nugal-1b06833b1' },
]

export function Contact({ onHireClick }: { onHireClick: () => void }) {
  return (
    <section id="contact" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 48px 120px', textAlign: 'center' }}>
        <Reveal>
          <p
            style={{
              margin: '0 0 8px',
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
              color: 'var(--accent-2)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            // Let's Build Together
          </p>
          <h2
            style={{
              margin: '0 0 16px',
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              fontWeight: 900,
              color: 'var(--fg)',
              letterSpacing: '-0.03em',
            }}
          >
            Got a system
            <br />
            to build?
          </h2>
          <p
            style={{
              margin: '0 auto 40px',
              color: 'var(--fg-muted)',
              fontSize: 15,
              maxWidth: 480,
              lineHeight: 1.65,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Open to internships, freelance projects, and anything that needs a fresh engineer's perspective.
          </p>

          <button
            onClick={onHireClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 30px',
              marginBottom: 40,
              background: 'var(--accent-2)',
              border: '1px solid var(--accent-2)',
              borderRadius: 10,
              color: 'var(--bg-elev)',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Fira Code', monospace",
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.opacity = '1'
            }}
          >
            Hire Me
          </button>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 24px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--fg-muted)',
                  fontSize: 12,
                  fontFamily: "'Fira Code', monospace",
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'all 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-2)'
                  e.currentTarget.style.color = 'var(--accent-2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--fg-muted)'
                }}
              >
                <span style={{ fontSize: 14 }}>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
