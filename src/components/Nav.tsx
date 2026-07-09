import { useActiveSection } from '../lib/useActiveSection'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

const LINK_IDS = LINKS.map((l) => l.id)

export function Nav() {
  const active = useActiveSection(LINK_IDS)
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(12px)', background: 'color-mix(in srgb, var(--bg) 78%, transparent)',
      borderBottom: '1px solid var(--border)',
    }}>
      <nav style={{
        maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <a href="#home" style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22,
          color: 'var(--fg)', textDecoration: 'none',
        }}>Moises<span style={{ color: 'var(--accent)' }}>.</span></a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ul style={{
            display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0,
          }} className="nav-links">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} style={{
                  display: 'inline-block', padding: '8px 12px', borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15, textDecoration: 'none',
                  color: active === l.id ? 'var(--accent)' : 'var(--fg-muted)',
                  fontWeight: active === l.id ? 600 : 400, transition: 'color 0.2s',
                }}>{l.label}</a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
