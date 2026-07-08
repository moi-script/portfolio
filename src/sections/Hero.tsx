import type { CSSProperties } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { Reveal } from '../components/Reveal'
import { useTheme } from '../theme/ThemeContext'

const calendarTheme = {
  light: ['#e9edf5', '#b9c9ef', '#7aa0f0', '#4f7cf0', '#2f6bff'],
  dark: ['#0f1626', '#0a3a2e', '#0f7a54', '#12b374', '#00ff88'],
}

const CTA_BASE: CSSProperties = {
  padding: '13px 30px',
  borderRadius: '8px',
  fontFamily: "'Fira Code', monospace",
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textDecoration: 'none',
  display: 'inline-block',
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
}

const STAT_PILLS = ['3+ yrs Node.js', 'MERN Stack', 'AI / RAG / OCR', 'CompEng Student']

export function Hero() {
  const { theme } = useTheme()
  return (
    <section
      id="top"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 48px 60px',
        maxWidth: 1300,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background motif: token-driven grid + faint radial glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.5,
          backgroundImage: `
            radial-gradient(ellipse at 75% 30%, color-mix(in srgb, var(--accent-2) 18%, transparent) 0%, transparent 55%),
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: 'auto, 64px 64px, 64px 64px',
        }}
      />

      <div style={{ maxWidth: 720, position: 'relative', zIndex: 1 }}>
        <Reveal delay={0}>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: '13px',
              color: 'var(--accent-2)',
              letterSpacing: '0.05em',
              marginBottom: '18px',
            }}
          >
            // Initializing profile&hellip;
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 72px)',
              color: 'var(--fg)',
              margin: '0 0 18px',
              lineHeight: 1.05,
            }}
          >
            Hi, I&rsquo;m Moi.
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              color: 'var(--fg-muted)',
              margin: '0 0 14px',
              maxWidth: 600,
              lineHeight: 1.6,
            }}
          >
            Computer Engineering student building systems that earn their keep.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: '13px',
              color: 'var(--accent-2)',
              marginBottom: '36px',
            }}
          >
            &gt; Stack: MongoDB · Express · React · TypeScript · Node.js · Python
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <a
              href="#work"
              style={{
                ...CTA_BASE,
                background: 'var(--accent-2)',
                color: 'var(--bg-elev)',
                border: '1px solid var(--accent-2)',
              }}
            >
              View work
            </a>
            <a
              href="/Moises_Nugal_CV_Polished.docx"
              download="Moises_Nugal_CV.docx"
              style={{
                ...CTA_BASE,
                background: 'transparent',
                color: 'var(--accent-2)',
                border: '1px solid var(--accent-2)',
              }}
            >
              Download CV
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {STAT_PILLS.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '10px',
                  color: 'var(--fg-faint)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Contribution graph — proof of consistency, embedded in the hero */}
        <Reveal delay={0.48}>
          <div style={{ marginTop: '40px' }}>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: '11px',
                color: 'var(--accent-2)',
                letterSpacing: '0.05em',
                marginBottom: '14px',
              }}
            >
              &gt; Consistency, visualized · @moi-script
            </div>
            <div
              style={{
                overflowX: 'auto',
                minHeight: 120,
                color: 'var(--fg-muted)',
                paddingBottom: '4px',
              }}
            >
              <GitHubCalendar
                username="moi-script"
                colorScheme={theme}
                theme={calendarTheme}
                blockSize={10}
                blockMargin={3}
                fontSize={11}
                showColorLegend={false}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
