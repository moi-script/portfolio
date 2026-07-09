import { useRef } from 'react'
import { motion, useScroll, useReducedMotion } from 'framer-motion'
import { acts } from '../data/story'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'

export function Timeline() {
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  // Progress 0 when the list top reaches ~85% down the viewport, 1 when its
  // bottom passes ~55% — so the accent line fills as you scroll the stages.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 85%', 'end 55%'],
  })

  return (
    <section id="journey" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
      <SectionHeading kicker="How I got here" title="My Journey" />
      <div ref={trackRef} style={{ position: 'relative', paddingLeft: 32 }}>
        {/* faint base track */}
        <div aria-hidden style={{
          position: 'absolute', left: 7, top: 6, bottom: 6, width: 2,
          background: 'var(--border)',
        }} />
        {/* accent line that fills with scroll progress */}
        <motion.div aria-hidden style={{
          position: 'absolute', left: 7, top: 6, bottom: 6, width: 2,
          background: 'linear-gradient(var(--accent), var(--accent-2))',
          transformOrigin: 'top',
          scaleY: reduce ? 1 : scrollYProgress,
        }} />
        {acts.map((act, i) => (
          <Reveal key={act.id} delay={i * 0.08}>
            <div style={{ position: 'relative', paddingBottom: 36 }}>
              <motion.span
                aria-hidden
                initial={reduce ? false : { scale: 0.3, opacity: 0.5 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-45% 0px -45% 0px' }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                style={{
                  position: 'absolute', left: -32, top: 4, width: 16, height: 16,
                  borderRadius: '50%', background: 'var(--accent)',
                  border: '3px solid var(--bg)',
                  boxShadow: '0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent)',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 13, color: 'var(--accent)' }}>{act.index}</span>
                <h3 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: 'var(--fg)' }}>{act.title}</h3>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--fg-faint)' }}>{act.kicker}</span>
              </div>
              <p style={{ margin: '8px 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: 'var(--fg-muted)' }}>{act.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
