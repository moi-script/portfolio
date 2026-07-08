import { GitHubCalendar } from 'react-github-calendar'

const inkTheme = {
  light: ['#e5d3a8', '#c9a961', '#b8860b', '#8a6508', '#5c4406'],
  dark: ['#e5d3a8', '#c9a961', '#b8860b', '#8a6508', '#5c4406'],
}

export function LedgerContent() {
  return (
    <div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
        Activity Ledger
      </p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(22px,3vw,34px)', color: 'var(--ink)', margin: '0 0 20px' }}>
        A year of commits.
      </h2>
      <div style={{ color: 'var(--ink-muted)', overflowX: 'auto' }}>
        <GitHubCalendar username="moi-script" colorScheme="light" theme={inkTheme} blockSize={9} blockMargin={3} fontSize={11} showColorLegend={false} />
      </div>
    </div>
  )
}
