import { ProfileMedallion } from './ProfileMedallion'
import type { SectionId } from '../navMap'

const CTA: React.CSSProperties = {
  padding: '11px 22px',
  borderRadius: 8,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-block',
}

export function IntroContent({ onNavigate }: { onNavigate?: (s: SectionId) => void }) {
  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
      <ProfileMedallion size={170} />
      <div style={{ flex: 1, minWidth: 220 }}>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(30px, 4vw, 48px)',
            color: 'var(--ink)',
            margin: '0 0 12px',
            lineHeight: 1.05,
          }}
        >
          Hi, I&rsquo;m Moi.
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: 'var(--ink-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
          Computer Engineering student building systems that earn their keep.
        </p>
        <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: 'var(--ink-muted)', margin: '0 0 22px' }}>
          MongoDB · Express · React · TypeScript · Node.js · Python
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigate?.('work')}
            style={{ ...CTA, background: 'var(--gold-deep)', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}
          >
            View work
          </button>
          <a
            href="/Moises_Nugal_CV_Polished.docx"
            download="Moises_Nugal_CV.docx"
            style={{ ...CTA, background: 'transparent', color: 'var(--ink)', border: '1px solid var(--gold-deep)' }}
          >
            Download CV
          </a>
        </div>
      </div>
    </div>
  )
}
