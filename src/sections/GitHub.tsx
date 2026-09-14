import { useEffect, useState } from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import type { Activity } from 'react-activity-calendar'
import { useTheme } from '../theme/ThemeContext'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const USERNAME = 'moi-script'

const coffeeLevels = {
  light: ['#eaddc9', '#e0c39a', '#cf9d63', '#b87a3d', '#8a5424'],
  dark: ['#241812', '#5a3c20', '#8a5424', '#c8874f', '#e0a668'],
}

interface ContributionsFile {
  total: number
  contributions: Activity[]
}

export function GitHub() {
  const { theme } = useTheme()
  const [data, setData] = useState<ContributionsFile | null>(null)

  // Generated from the GitHub profile by scripts/fetch-contributions.mjs,
  // so the numbers match github.com/moi-script exactly.
  useEffect(() => {
    let alive = true
    fetch('/github-contributions.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: ContributionsFile) => { if (alive) setData(d) })
      .catch(() => {
        /* leave the section in its loading state */
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
            {data ? data.total.toLocaleString() : '—'}
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
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'block', textDecoration: 'none',
            background: 'var(--bg-elev)', border: '1px solid var(--border)',
            borderRadius: 18, padding: 'clamp(20px, 4vw, 36px)', overflowX: 'auto',
            color: 'var(--fg-muted)', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <ActivityCalendar
            data={data?.contributions ?? []}
            loading={!data}
            colorScheme={theme}
            theme={{ light: coffeeLevels.light, dark: coffeeLevels.dark }}
            fontSize={13}
            blockSize={12}
            showTotalCount={false}
          />
        </a>
      </Reveal>
    </Section>
  )
}
