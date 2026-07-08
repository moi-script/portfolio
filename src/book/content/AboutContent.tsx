const modules = [
  { label: 'The Architect', icon: '⬡', desc: 'I design scalable full-stack systems, thinking about how data flows from a MongoDB schema to a React frontend before writing a single line of UI.' },
  { label: 'The Logic', icon: '⌘', desc: '2+ years of breaking and fixing things. My foundation is Node.js and Express, built through real DSA-driven projects rather than tutorials.' },
  { label: 'The Solver', icon: '◈', desc: 'I build to remove friction. Whether it’s OCR reading receipts or an AI assistant, the goal is to make technology work for the person using it.' },
]

export function AboutContent() {
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>About</p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(20px,2.6vw,30px)', color: 'var(--ink)', margin: '0 0 14px' }}>Architecting Logic. Solving Systems.</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink-muted)', margin: '0 0 18px' }}>
        Computer Engineering student at National College of Science and Technology. I approach software the way an engineer approaches a system — schema-first, with an interest in AI-driven automation.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {modules.map((m) => (
          <div key={m.label} style={{ flex: 1, minWidth: 150, border: '1px solid var(--parchment-edge)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{m.icon}</div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--gold-deep)', margin: '0 0 6px' }}>{m.label}</h4>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.5, color: 'var(--ink-muted)', margin: 0 }}>{m.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2f8f4e' }} />
        Open to internships &amp; freelance
      </div>
    </div>
  )
}
