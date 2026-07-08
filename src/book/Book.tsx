import { Page } from './Page'
import { pageProgressToTurn } from './pageMath'
import { SPREADS } from './navMap'
import { BookChrome } from './BookChrome'

const Z_STEP = 0.01

export function Book({ progress }: { progress: number }) {
  return (
    <group>
      <BookChrome />
      {SPREADS.map((_, i) => {
        const turn = pageProgressToTurn(progress, i)
        // pages already turned stack toward the viewer on the left; unturned on the right
        const z = (turn > 0.5 ? i : SPREADS.length - i) * Z_STEP
        return <Page key={i} turn={turn} z={z} />
      })}
    </group>
  )
}
