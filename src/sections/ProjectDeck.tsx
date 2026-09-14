import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import type { Project } from '../data/projects'

const VISIBLE = 3 // front card + two peeking behind
const AUTO_MS = 5000
const WHEEL_LOCK_MS = 650
const SWIPE_PX = 70

function DeckCard({ project, front }: { project: Project; front: boolean }) {
  const shipped = project.status === 'shipped'
  const tab = front ? undefined : -1
  return (
    <article className={`deck-card${front ? '' : ' is-back'}`} aria-hidden={!front}>
      <div className="deck-card-media">
        {project.image && <img src={project.image} alt="" draggable={false} />}
        <span className={`deck-card-status${shipped ? ' is-shipped' : ''}`}>
          {shipped ? 'Shipped' : 'In development'}
        </span>
        <h3 className="deck-card-title">{project.name}</h3>
      </div>
      <div className="deck-card-body">
        <p className="deck-card-summary">{project.summary}</p>
        <div className="deck-card-foot">
          <div className="deck-card-tags">
            {project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="deck-card-links">
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noreferrer" tabIndex={tab} className="is-primary">Live</a>
            )}
            <a href={project.github} target="_blank" rel="noreferrer" tabIndex={tab}>Code</a>
          </div>
        </div>
      </div>
    </article>
  )
}

// depth 0 = front. Cards further back sit lower, smaller, and dimmer.
const place = (depth: number) => ({
  y: depth * 22,
  scale: 1 - depth * 0.05,
  opacity: depth >= VISIBLE ? 0 : 1 - depth * 0.28,
  rotate: 0,
})

const variants = {
  enter: (dir: number) => (dir > 0 ? place(VISIBLE) : { ...place(0), y: -60, opacity: 0, rotate: -3 }),
  exit: (dir: number) => (dir > 0 ? { ...place(0), y: -80, opacity: 0, rotate: -4, zIndex: 10 } : place(VISIBLE)),
}

export function ProjectDeck({ projects }: { projects: Project[] }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const deckRef = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const n = projects.length

  const step = useCallback((d: number) => {
    setDir(d)
    setIndex((i) => (i + d + n) % n)
  }, [n])

  // Auto-advance while nobody is interacting.
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => { if (!paused.current) step(1) }, AUTO_MS)
    return () => clearInterval(id)
  }, [reduce, step])

  // Mouse wheel flips one card per gesture.
  useEffect(() => {
    const el = deckRef.current
    if (!el) return
    let lockedUntil = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = performance.now()
      if (now < lockedUntil || Math.abs(e.deltaY) < 4) return
      lockedUntil = now + WHEEL_LOCK_MS
      step(e.deltaY > 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [step])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_PX) step(1)
    else if (info.offset.x > SWIPE_PX) step(-1)
  }

  const stack = Array.from({ length: Math.min(VISIBLE, n) }, (_, d) => projects[(index + d) % n])

  return (
    <section
      className="showcase"
      aria-label="Projects"
      aria-roledescription="carousel"
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
      onFocus={() => { paused.current = true }}
      onBlur={() => { paused.current = false }}
    >
      <div className="aurora" aria-hidden><span /><span /><span /></div>

      <header className="showcase-head">
        <span className="showcase-label">Projects</span>
        <div className="deck-nav">
          <span className="deck-count" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
          <button type="button" onClick={() => step(-1)} aria-label="Previous project"><FiChevronLeft size={16} /></button>
          <button type="button" onClick={() => step(1)} aria-label="Next project"><FiChevronRight size={16} /></button>
        </div>
      </header>

      <div ref={deckRef} className="deck">
        <AnimatePresence initial={false} custom={dir}>
          {stack.map((project, depth) => (
            <motion.div
              key={project.id}
              className="deck-slot"
              custom={dir}
              variants={variants}
              initial="enter"
              animate={place(depth)}
              exit="exit"
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }}
              style={{ zIndex: VISIBLE - depth, transformOrigin: 'bottom center' }}
              drag={depth === 0 ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragEnd={depth === 0 ? onDragEnd : undefined}
            >
              <DeckCard project={project} front={depth === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
