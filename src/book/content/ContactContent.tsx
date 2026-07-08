const links = [
  { label: 'nugalmoises62@gmail.com', href: 'mailto:nugalmoises62@gmail.com' },
  { label: 'github.com/moi-script', href: 'https://github.com/moi-script' },
  { label: 'linkedin.com/in/moises-nugal', href: 'https://www.linkedin.com/in/moises-nugal-1b06833b1' },
]

export function ContactContent() {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>Contact</p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(24px,3.5vw,40px)', color: 'var(--ink)', margin: '0 0 12px' }}>Got a system to build?</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, color: 'var(--ink-muted)', margin: '0 auto 24px', maxWidth: 380 }}>
        Open to internships, freelance projects, and anything that needs a fresh engineer&rsquo;s perspective.
      </p>
      <a href="mailto:nugalmoises62@gmail.com?subject=Let's%20build%20something" style={{ display: 'inline-block', padding: '12px 26px', marginBottom: 22, background: 'var(--gold-deep)', color: '#fff', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Hire Me</a>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {links.map((l) => (
          <a key={l.label} href={l.href} style={{ padding: '10px 18px', border: '1px solid var(--parchment-edge)', borderRadius: 10, color: 'var(--ink-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: 12, textDecoration: 'none' }}>{l.label}</a>
        ))}
      </div>
    </div>
  )
}
