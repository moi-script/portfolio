import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

/**
 * A page section with a scroll-triggered entrance transition (fade + gentle
 * lift), applied once as it enters the viewport. Renders a real <section id>
 * so nav anchors and the active-section observer keep working. Respects
 * prefers-reduced-motion by rendering a plain section.
 */
export function Section({
  id,
  children,
  style,
}: {
  id: string
  children: ReactNode
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  if (reduce) {
    return (
      <section id={id} style={style}>
        {children}
      </section>
    )
  }
  return (
    <motion.section
      id={id}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  )
}
