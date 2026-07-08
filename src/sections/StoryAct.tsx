import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { Act } from '../data/story'

export function StoryAct({ act }: { act: Act }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 1, 0.2])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40])

  return (
    <section ref={ref} className="story-act" style={{ minHeight: '150vh', position: 'relative' }}>
      <style>{`
        @media (max-width: 768px) {
          .story-act {
            min-height: auto !important;
            padding: 48px 0;
          }
          .story-act .story-act__panel {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>
      <div className="story-act__panel" style={{ position: 'sticky', top: '20vh' }}>
        {reduce ? (
          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 48px' }}>
            <StoryActBody act={act} />
          </div>
        ) : (
          <motion.div style={{ opacity, y }}>
            <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 48px' }}>
              <StoryActBody act={act} />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function StoryActBody({ act }: { act: Act }) {
  return (
    <>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(60px, 10vw, 140px)',
          color: 'var(--accent-2)',
          lineHeight: 1,
          margin: '0 0 8px',
        }}
      >
        {act.index}
      </div>
      <p
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--fg-faint)',
          margin: '0 0 12px',
        }}
      >
        {act.kicker}
      </p>
      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(28px, 4vw, 48px)',
          color: 'var(--fg)',
          margin: '0 0 20px',
          letterSpacing: '-0.02em',
        }}
      >
        {act.title}
      </h3>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--fg-muted)',
          margin: 0,
          maxWidth: 640,
        }}
      >
        {act.body}
      </p>
    </>
  )
}
