import { Reveal } from './Reveal'

export function SectionHeading({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <Reveal>
      <div style={{ marginBottom: 40 }}>
        {kicker && (
          <p style={{
            margin: 0, fontFamily: "'Fira Code', monospace", fontSize: 13,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)',
          }}>{kicker}</p>
        )}
        <h2 style={{
          margin: '8px 0 0', fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--fg)', lineHeight: 1.1,
        }}>{title}</h2>
      </div>
    </Reveal>
  )
}
