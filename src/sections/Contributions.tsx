import { GitHubCalendar } from 'react-github-calendar'
import { useTheme } from '../theme/ThemeContext'
import { Reveal } from '../components/Reveal'

const explicitTheme = {
  light: ['#e9edf5', '#b9c9ef', '#7aa0f0', '#4f7cf0', '#2f6bff'],
  dark: ['#0f1626', '#0a3a2e', '#0f7a54', '#12b374', '#00ff88'],
}

export function Contributions() {
  const { theme } = useTheme()
  return (
    <section id="contributions" style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 48px' }}>
      <Reveal>
        <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-2)', margin: '0 0 8px' }}>// Consistency, visualized</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(26px,4vw,44px)', color: 'var(--fg)', margin: '0 0 32px', letterSpacing: '-0.02em' }}>Showing up, every day.</h2>
        <div style={{ minHeight: 180, overflowX: 'auto', color: 'var(--fg-muted)' }}>
          <GitHubCalendar username="moi-script" colorScheme={theme} theme={explicitTheme} />
        </div>
      </Reveal>
    </section>
  )
}
