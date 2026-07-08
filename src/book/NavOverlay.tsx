import { ThemeToggle } from '../components/ThemeToggle'
import type { SectionId } from './navMap'

const LINKS: { label: string; section: SectionId }[] = [
  { label: 'Intro', section: 'intro' },
  { label: 'Story', section: 'story' },
  { label: 'Work', section: 'work' },
  { label: 'About', section: 'about' },
  { label: 'Contact', section: 'contact' },
]

export function NavOverlay({ onJump }: { onJump: (section: SectionId) => void }) {
  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', color: 'var(--gold)',
      }}
    >
      <button
        onClick={() => onJump('intro')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}
      >
        Moises Nugal
      </button>
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        {LINKS.map((l) => (
          <button
            key={l.section}
            onClick={() => onJump(l.section)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.06em', color: 'var(--parchment)' }}
          >
            {l.label}
          </button>
        ))}
        <ThemeToggle />
        <button
          onClick={() => onJump('contact')}
          style={{ padding: '7px 16px', border: '1px solid var(--gold)', borderRadius: 6, background: 'transparent', color: 'var(--gold)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.08em' }}
        >
          Hire Me
        </button>
      </div>
    </nav>
  )
}
