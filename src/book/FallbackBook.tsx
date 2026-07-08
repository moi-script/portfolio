import { ParchmentCard } from './ParchmentCard'
import { NavOverlay } from './NavOverlay'
import { PAGES } from './pages'
import { pageForSection, type SectionId } from './navMap'

export function FallbackBook() {
  const jumpTo = (section: SectionId) => {
    document.getElementById(`spread-${pageForSection(section)}`)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div style={{ minHeight: '100vh', background: 'var(--room-bg)', padding: '88px 16px 60px' }}>
      <NavOverlay onJump={jumpTo} />
      {PAGES.map((p, i) => {
        const node = p.render(jumpTo)
        if (!node) return null
        return (
          <ParchmentCard key={i} id={`spread-${i}`}>
            {node}
          </ParchmentCard>
        )
      })}
    </div>
  )
}
