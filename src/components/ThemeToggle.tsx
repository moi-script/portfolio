import { useTheme } from '../theme/ThemeContext'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        width: 40, height: 40, borderRadius: 10, cursor: 'pointer',
        background: 'transparent', border: '1px solid var(--border)',
        color: 'var(--accent-2)', fontSize: 16, lineHeight: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}
    >
      {theme === 'light' ? '☀' : '☾'}
    </button>
  )
}
