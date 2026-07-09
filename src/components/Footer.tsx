const GITHUB = 'https://github.com/moi-script'
const EMAIL = 'nugalmoises62@gmail.com'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace with real LinkedIn URL

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)', padding: '32px 24px',
      display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
      justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto',
    }}>
      <p style={{ margin: 0, color: 'var(--fg-faint)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        © 2026 John Moises
      </p>
      <div style={{ display: 'flex', gap: 18, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <a href={GITHUB} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>GitHub</a>
        <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>LinkedIn</a>
        <a href={`mailto:${EMAIL}`} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Email</a>
      </div>
    </footer>
  )
}
