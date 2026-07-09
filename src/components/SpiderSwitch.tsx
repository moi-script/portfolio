import { useRef } from 'react'
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'
import { shouldToggle } from '../lib/pullSwitch'

const REST_LEN = 64        // resting web length (px)
const MAX_PULL = 120       // furthest the spider can be pulled
const PULL_THRESHOLD = 60  // pull distance that counts as a real switch
const SNAP = { type: 'spring' as const, stiffness: 260, damping: 11 }

function SpiderGlyph() {
  // Body + head + 8 legs + eyes. Uses currentColor so it stays visible in both themes.
  return (
    <svg width="46" height="40" viewBox="0 0 46 40" fill="none" aria-hidden focusable="false">
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M23 22 C14 18 10 24 6 22" />
        <path d="M23 24 C13 24 9 30 5 30" />
        <path d="M23 26 C14 30 11 35 7 37" />
        <path d="M23 22 C15 20 12 16 9 15" />
        <path d="M23 22 C32 18 36 24 40 22" />
        <path d="M23 24 C33 24 37 30 41 30" />
        <path d="M23 26 C32 30 35 35 39 37" />
        <path d="M23 22 C31 20 34 16 37 15" />
      </g>
      <ellipse cx="23" cy="25" rx="8" ry="9" fill="currentColor" />
      <circle cx="23" cy="15" r="5.5" fill="currentColor" />
      <circle cx="21" cy="14" r="1.1" fill="var(--accent)" />
      <circle cx="25" cy="14" r="1.1" fill="var(--accent)" />
    </svg>
  )
}

export function SpiderSwitch({ onToggle, isNight }: { onToggle: () => void; isNight: boolean }) {
  const reduce = useReducedMotion()
  const y = useMotionValue(0)
  const webScaleY = useTransform(y, (v) => (REST_LEN + Math.max(0, v)) / REST_LEN)
  const moved = useRef(false)

  const label = isNight
    ? 'Pull the spider to switch to day'
    : 'Pull the spider to switch to night'

  // Scripted pull for click / keyboard (and the whole interaction when reduced motion is on).
  const scriptedPull = async () => {
    if (reduce) {
      onToggle()
      return
    }
    await animate(y, MAX_PULL * 0.75, { duration: 0.16, ease: 'easeIn' }).finished
    onToggle()
    animate(y, 0, SNAP)
  }

  return (
    <div className="spider-switch" aria-hidden={false}>
      {/* pendulum wrapper: gentle idle sway around the top anchor */}
      <motion.div
        className="spider-pendulum"
        style={{ transformOrigin: 'top center' }}
        animate={reduce ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
        transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div className="spider-web" aria-hidden style={{ scaleY: webScaleY, transformOrigin: 'top' }} />
        <motion.button
          type="button"
          className="spider-body"
          aria-label={label}
          aria-pressed={isNight}
          style={{ y }}
          drag={reduce ? false : 'y'}
          dragConstraints={{ top: 0, bottom: MAX_PULL }}
          dragElastic={0.35}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          onPointerDown={() => { moved.current = false }}
          onDragStart={() => { moved.current = true }}
          onDrag={(_e, info) => { if (Math.abs(info.offset.y) > 4) moved.current = true }}
          onDragEnd={(_e, info) => {
            const dist = Math.max(0, info.offset.y)
            if (shouldToggle(dist, info.velocity.y, PULL_THRESHOLD)) onToggle()
            animate(y, 0, SNAP)
          }}
          onClick={() => { if (!moved.current) void scriptedPull() }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              void scriptedPull()
            }
          }}
        >
          <motion.span
            className="spider-glyph"
            animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
            transition={reduce ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SpiderGlyph />
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  )
}
