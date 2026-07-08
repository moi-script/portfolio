import { Page } from './Page'
import { BookChrome } from './BookChrome'
import { pageProgressToTurn, nearestSpread } from './pageMath'
import { SPREADS } from './navMap'
import { PAGES } from './pages'

const Z_STEP = 0.01

export function Book({ progress }: { progress: number }) {
  const settled = nearestSpread(progress)
  const isSettled = Math.abs(progress - settled) < 0.02

  return (
    <group>
      <BookChrome progress={progress} />
      {SPREADS.map((_, i) => {
        const turn = pageProgressToTurn(progress, i)
        const z = (turn > 0.5 ? i : SPREADS.length - i) * Z_STEP
        // The content for spread `settled` lives on the page that reveals it.
        const showsContent = isSettled && i === settled
        return (
          <Page
            key={i}
            turn={turn}
            z={z}
            isResting={showsContent}
            content={PAGES[i]?.render}
          />
        )
      })}
    </group>
  )
}
