import { GitHubCalendar } from 'react-github-calendar'
import { useTheme } from '../theme/ThemeContext'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

const coffeeLevels = {
  light: ['#eaddc9', '#e0c39a', '#cf9d63', '#b87a3d', '#8a5424'],
  dark: ['#241812', '#5a3c20', '#8a5424', '#c8874f', '#e0a668'],
}

export function GitHub() {
  const { theme } = useTheme()
  return (
    <section id="github" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="Consistency" title="GitHub Activity" />
      <Reveal>
        <div style={{
          background: 'var(--bg-elev)', border: '1px solid var(--border)',
          borderRadius: 18, padding: 'clamp(20px, 4vw, 36px)', overflowX: 'auto',
          color: 'var(--fg-muted)', fontFamily: "'DM Sans', sans-serif",
        }}>
          <GitHubCalendar
            username="moi-script"
            colorScheme={theme}
            theme={{ light: coffeeLevels.light, dark: coffeeLevels.dark }}
            fontSize={13}
            blockSize={12}
          />
        </div>
      </Reveal>
    </section>
  )
}
