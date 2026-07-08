export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '24px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <span
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 10,
          color: 'var(--fg-faint)',
          letterSpacing: '0.06em',
        }}
      >
        Built by Moi · 2026 · Cavite, PH 🇵🇭
      </span>
      <span
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 10,
          color: 'var(--fg-faint)',
        }}
      >
        {' '}
        <span style={{ color: 'var(--accent-2)' }}>●</span>
      </span>
    </footer>
  )
}
