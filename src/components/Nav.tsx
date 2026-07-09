import { useState } from 'react'
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

const MENU_ID = 'nav-mobile-menu'

export function Nav() {
  const active = useActiveSection(LINK_IDS)
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(12px)', background: 'color-mix(in srgb, var(--bg) 78%, transparent)',
      borderBottom: '1px solid var(--border)',
    }}>
      <nav style={{
        maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        position: 'relative',
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
          <button
            type="button"
            className="nav-hamburger"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen((v) => !v)}
            style={{
              width: 40, height: 40, borderRadius: 10, cursor: 'pointer',
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--fg)', fontSize: 16, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {open ? '✕' : '☰'}
          </button>
          <ThemeToggle />
        </div>
        {open && (
          <ul
            id={MENU_ID}
            className="nav-mobile-menu"
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              display: 'flex', flexDirection: 'column', gap: 2,
              listStyle: 'none', margin: 0, padding: '8px 24px 16px',
              background: 'var(--bg-elev)', borderBottom: '1px solid var(--border)',
            }}
          >
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', padding: '10px 12px', borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 16, textDecoration: 'none',
                    color: active === l.id ? 'var(--accent)' : 'var(--fg-muted)',
                    fontWeight: active === l.id ? 600 : 400, transition: 'color 0.2s',
                  }}
                >{l.label}</a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
