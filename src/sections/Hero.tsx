import type { CSSProperties } from 'react'
import { Reveal } from '../components/Reveal'
import { SpiderSwitch } from '../components/SpiderSwitch'
import { PersonaScene } from './PersonaScene'
import { useTheme } from '../theme/ThemeContext'

const RESUME = '/Moises_Nugal_CV_Polished.docx' // current CV
const GITHUB = 'https://github.com/moi-script'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace
const EMAIL = 'nugalmoises62@gmail.com'

const btnBase: CSSProperties = {
  padding: '13px 26px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
  fontSize: 15, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  display: 'inline-block', transition: 'transform 0.15s, opacity 0.2s',
}

export function Hero() {
  const { theme, toggle } = useTheme()
  const isNight = theme === 'dark'
  return (
    <section id="home" style={{ padding: '48px 24px 24px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', background: 'var(--bg-elev)',
        border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden',
        boxShadow: 'var(--shadow)', position: 'relative',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        alignItems: 'center', gap: 24, transition: 'background 0.6s ease',
      }} className="hero-grid">
        {/* spider pull-switch in the top-right corner */}
        <div className="hero-spider-mount">
          <SpiderSwitch onToggle={toggle} isNight={isNight} />
        </div>
        {/* accent glow */}
        <div aria-hidden style={{
          position: 'absolute', right: '8%', top: '20%', width: 340, height: 340,
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.28, filter: 'blur(30px)', pointerEvents: 'none', transition: 'opacity 0.6s ease',
        }} />
        <div style={{ padding: '56px clamp(24px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <h1 style={{
              margin: 0, fontFamily: "'Syne', sans-serif", fontWeight: 900,
              fontSize: 'clamp(34px, 5.5vw, 60px)', lineHeight: 1.05, color: 'var(--fg)',
            }}>Hi, I'm John Moises</h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{
              margin: '10px 0 0', fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: 'clamp(20px, 3vw, 30px)', color: 'var(--accent)',
            }}>Full-Stack Developer</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{
              margin: '20px 0 0', maxWidth: 460, fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, lineHeight: 1.7, color: 'var(--fg-muted)',
            }}>
              Computer Engineering student. I build full-stack apps and wire AI into
              them, like receipt scanning that reads prices off a photo and agents that
              analyze markets.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
              <a href="#projects" style={{ ...btnBase, background: 'var(--accent)', color: '#1a120b' }}>View Projects</a>
              <a href="#contact" style={{ ...btnBase, background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)' }}>Let's Talk</a>
              <a href={RESUME} download style={{ ...btnBase, background: 'transparent', color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>Download Resume</a>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <div style={{ display: 'flex', gap: 14, marginTop: 34, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
              <a href={GITHUB} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>GitHub</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>LinkedIn</a>
              <a href={`mailto:${EMAIL}`} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Email</a>
            </div>
          </Reveal>
        </div>
        <PersonaScene />
      </div>
    </section>
  )
}
