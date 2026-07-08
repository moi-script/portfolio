import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Backdrop } from './Backdrop'
import { Book } from './Book'
import { NavOverlay } from './NavOverlay'
import { SPREADS, pageForSection, type SectionId } from './navMap'
import { nearestSpread, easeSettle } from './pageMath'

const PAGE_COUNT = SPREADS.length
const SETTLE_DELAY_MS = 140
const SETTLE_DURATION_MS = 260

export function BookCanvas() {
  const [progress, setProgress] = useState(0)
  const rawRef = useRef(0)
  const idleTimer = useRef<number | null>(null)
  const settleRaf = useRef<number | null>(null)

  useEffect(() => {
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? (window.scrollY / max) * PAGE_COUNT : 0
    }

    const settle = () => {
      const start = rawRef.current
      const target = nearestSpread(start)
      if (start === target) return
      const t0 = performance.now()
      const step = () => {
        const t = Math.min(1, (performance.now() - t0) / SETTLE_DURATION_MS)
        const v = start + (target - start) * easeSettle(t)
        rawRef.current = v
        setProgress(v)
        if (t < 1) {
          settleRaf.current = requestAnimationFrame(step)
        } else {
          rawRef.current = target
          setProgress(target)
          settleRaf.current = null
        }
      }
      settleRaf.current = requestAnimationFrame(step)
    }

    const onScroll = () => {
      // cancel any in-flight settle so it doesn't fight the user's scroll
      if (settleRaf.current !== null) {
        cancelAnimationFrame(settleRaf.current)
        settleRaf.current = null
      }
      rawRef.current = readScroll()
      setProgress(rawRef.current)
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(settle, SETTLE_DELAY_MS)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current)
      if (settleRaf.current !== null) cancelAnimationFrame(settleRaf.current)
    }
  }, [])

  const jumpTo = (section: SectionId) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max <= 0) return
    const target = (pageForSection(section) / PAGE_COUNT) * max
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <>
      <NavOverlay onJump={jumpTo} />
      {/* tall spacer drives scrolling; canvas is fixed behind it */}
      <div style={{ height: `${(PAGE_COUNT + 1) * 100}vh` }} aria-hidden />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [1.2, 0, 8], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement
            // Let the browser RESTORE a lost context instead of leaving it dead
            // (three shows a blank canvas otherwise). Log both for diagnosis.
            canvas.addEventListener(
              'webglcontextlost',
              (e) => {
                e.preventDefault()
                console.warn('[book] WebGL context LOST — will attempt restore', e)
              },
              false,
            )
            canvas.addEventListener('webglcontextrestored', () => {
              console.warn('[book] WebGL context RESTORED')
            })
          }}
        >
          <Backdrop />
          <Book progress={progress} onNavigate={jumpTo} />
        </Canvas>
      </div>
    </>
  )
}
