import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = ['Story', 'Work', 'About', 'Contact']

export function Nav({ onHireClick }: { onHireClick: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        .nav-link {
          color: var(--fg-muted);
          text-decoration: none;
          font-size: 12px;
          font-family: 'Fira Code', monospace;
          letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--fg); }

        .hire-btn-desktop {
          padding: 8px 18px;
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--accent-2) 35%, transparent);
          border-radius: 6px;
          color: var(--accent-2);
          font-size: 11px;
          font-family: 'Fira Code', monospace;
          cursor: pointer;
          letter-spacing: 0.08em;
          transition: background 0.2s;
        }
        .hire-btn-desktop:hover {
          background: color-mix(in srgb, var(--accent-2) 8%, transparent);
        }

        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          padding: 0;
          transition: border-color 0.2s;
        }
        .hamburger-btn:hover { border-color: color-mix(in srgb, var(--accent-2) 35%, transparent); }

        .mobile-nav-link {
          color: var(--fg-muted);
          text-decoration: none;
          font-size: 13px;
          font-family: 'Fira Code', monospace;
          letter-spacing: 0.08em;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .mobile-nav-link:hover {
          color: var(--accent-2);
          background: color-mix(in srgb, var(--accent-2) 5%, transparent);
          border-color: color-mix(in srgb, var(--accent-2) 15%, transparent);
        }

        .hire-btn-mobile {
          padding: 13px 16px;
          background: color-mix(in srgb, var(--accent-2) 7%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-2) 25%, transparent);
          border-radius: 8px;
          color: var(--accent-2);
          font-size: 12px;
          font-family: 'Fira Code', monospace;
          cursor: pointer;
          letter-spacing: 0.08em;
          text-align: left;
          transition: background 0.2s;
          width: 100%;
        }
        .hire-btn-mobile:hover { background: color-mix(in srgb, var(--accent-2) 12%, transparent); }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .site-nav { padding: 0 24px !important; }
        }
      `}</style>

      <nav className="site-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 48px',
        height: '64px',
        background: scrolled || mobileMenuOpen
          ? 'color-mix(in srgb, var(--bg) 90%, transparent)'
          : 'transparent',
        backdropFilter: scrolled || mobileMenuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrolled || mobileMenuOpen ? '1px solid var(--border)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: '14px',
          color: 'var(--accent-2)',
          letterSpacing: '0.1em',
          fontWeight: 500,
        }}>moi.dev<span style={{ animation: 'blink 1.2s infinite', marginLeft: '2px' }}>_</span></span>

        {/* Desktop links — hidden on mobile via class */}
        <div className="nav-links" style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {NAV_LINKS.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
          ))}
          <ThemeToggle />
          <button className="hire-btn-desktop" onClick={onHireClick}>Hire Me</button>
        </div>

        {/* Hamburger button — visible only on mobile */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {/* Three bars that morph to X */}
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: '18px',
              height: '1.5px',
              background: mobileMenuOpen ? 'var(--accent-2)' : 'var(--fg-muted)',
              borderRadius: '2px',
              transformOrigin: 'center',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              transform: mobileMenuOpen
                ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                : i === 2 ? 'translateY(-6.5px) rotate(-45deg)'
                : 'scaleX(0)'
                : 'none',
              opacity: mobileMenuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-nav-open"
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              background: 'color-mix(in srgb, var(--bg) 97%, transparent)',
              borderBottom: '1px solid var(--border)',
              backdropFilter: 'blur(24px)',
              padding: '20px 24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 99,
            }}
          >
            {NAV_LINKS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link"
              >
                <span style={{ color: 'color-mix(in srgb, var(--accent-2) 40%, transparent)', marginRight: '10px' }}>//</span>
                {item}
              </a>
            ))}

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'var(--border)',
              margin: '8px 0',
            }} />

            {/* Hire Me in mobile menu */}
            <button
              className="hire-btn-mobile"
              onClick={() => { onHireClick(); setMobileMenuOpen(false) }}
            >
              ◉ Hire Me
            </button>

            {/* Quick contact pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px',
              flexWrap: 'wrap',
            }}>
              {['github.com/moi-script', 'nugalmoises62@gmail.com'].map(txt => (
                <span key={txt} style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '9px',
                  color: 'var(--fg-faint)',
                  letterSpacing: '0.06em',
                }}>{txt}</span>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
