import { useEffect, useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { useTheme } from '../theme/ThemeContext'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const USERNAME = 'moi-script'

const coffeeLevels = {
  light: ['#eaddc9', '#e0c39a', '#cf9d63', '#b87a3d', '#8a5424'],
  dark: ['#241812', '#5a3c20', '#8a5424', '#c8874f', '#e0a668'],
}

export function GitHub() {
  const { theme } = useTheme()
  const [total, setTotal] = useState<number | null>(null)

  // Pull the real last-year total from the same public API the calendar uses,
  // so the highlighted number stays accurate over time instead of being hardcoded.
  useEffect(() => {
    let alive = true
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((r) => r.json())
      .then((d: { contributions?: { count: number }[] }) => {
        if (!alive) return
        if (Array.isArray(d.contributions)) {
          setTotal(d.contributions.reduce((sum, c) => sum + (c.count ?? 0), 0))
        }
      })
      .catch(() => {
        /* leave total null; the calendar still renders its own data */
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <Section id="github" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Consistency" title="GitHub Activity" />
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900, lineHeight: 1,
            fontSize: 'clamp(44px, 8vw, 76px)', color: 'var(--accent)',
            textShadow: '0 0 34px color-mix(in srgb, var(--accent) 45%, transparent)',
          }}>
            {total !== null ? total.toLocaleString() : '—'}
          </span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(16px, 2.2vw, 20px)',
            color: 'var(--fg-muted)', fontWeight: 500,
          }}>
            contributions in the last year
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div style={{
          background: 'var(--bg-elev)', border: '1px solid var(--border)',
          borderRadius: 18, padding: 'clamp(20px, 4vw, 36px)', overflowX: 'auto',
          color: 'var(--fg-muted)', fontFamily: "'DM Sans', sans-serif",
        }}>
          <GitHubCalendar
            username={USERNAME}
            colorScheme={theme}
            theme={{ light: coffeeLevels.light, dark: coffeeLevels.dark }}
            fontSize={13}
            blockSize={12}
            showTotalCount={false}
          />
        </div>
      </Reveal>
    </Section>
  )
}
