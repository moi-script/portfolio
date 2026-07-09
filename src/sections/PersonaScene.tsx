import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '../theme/ThemeContext'
import portrait from '../assets/profile_pic_portfolio.png'

const DAY_FILTER = 'grayscale(0.15) sepia(0.28) saturate(1.2) brightness(1.06) contrast(1.02) hue-rotate(-6deg)'
const NIGHT_FILTER = 'grayscale(0.45) sepia(0.6) saturate(1.4) brightness(0.82) contrast(1.06) hue-rotate(-14deg)'

function DayScene() {
  return (
    <div className="scene day-scene" aria-hidden>
      <div className="day-wash" />
      <div className="prop day-laptop" />
      <div className="prop day-mug" />
      <div className="prop day-plant" />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="mote"
          style={{ left: `${12 + i * 18}%`, top: `${20 + (i % 3) * 22}%` }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}
    </div>
  )
}

function NightScene() {
  return (
    <div className="scene night-scene" aria-hidden>
      <div className="night-wash" />
      <div className="night-extra">
        <div className="monitor m-left" />
        <div className="monitor m-center" />
        <div className="monitor m-right" />
        <div className="rgb-underglow" />
      </div>
      <div className="scanlines" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className="spark"
          style={{ left: `${8 + i * 15}%`, top: `${15 + (i % 4) * 20}%` }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
    </div>
  )
}

export function PersonaScene() {
  const { theme } = useTheme()
  const reduce = useReducedMotion()
  const night = theme === 'dark'

  return (
    <div className="persona-scene hero-photo">
      <img
        className="hero-photo-img"
        src={portrait}
        alt="John Moises"
        style={{ filter: night ? NIGHT_FILTER : DAY_FILTER, transition: 'filter 0.6s ease' }}
      />
      {/* No mode="wait": old and new scenes overlap so they cross-fade (dissolve) rather than blanking between. */}
      <AnimatePresence>
        <motion.div
          key={theme}
          className="scene-layer"
          aria-hidden
          initial={reduce ? false : { opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {night ? <NightScene /> : <DayScene />}
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="hero-photo-fade" style={{ position: 'absolute', inset: 0 }} />
    </div>
  )
}
