import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Backdrop } from './Backdrop'
import { Book } from './Book'
import { SPREADS } from './navMap'

const PAGE_COUNT = SPREADS.length

export function BookCanvas() {
  const [progress, setProgress] = useState(0)
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? (window.scrollY / max) * PAGE_COUNT : 0
      scrollRef.current = p
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* tall spacer drives scrolling; canvas is fixed behind it */}
      <div style={{ height: `${(PAGE_COUNT + 1) * 100}vh` }} aria-hidden />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Canvas camera={{ position: [1.2, 0, 8], fov: 40 }}>
          <Backdrop />
          <Book progress={progress} />
        </Canvas>
      </div>
    </>
  )
}
