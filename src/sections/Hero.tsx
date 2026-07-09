import type { CSSProperties } from 'react'
import { Reveal } from '../components/Reveal'
import portrait from '../assets/profile_pic_1.png'

const RESUME = '/resume.pdf' // TODO: drop resume.pdf into public/
const GITHUB = 'https://github.com/moi-script'
const LINKEDIN = 'https://www.linkedin.com/in/your-handle' // TODO: replace
const EMAIL = 'nugalmoises62@gmail.com'

const btnBase: CSSProperties = {
  padding: '13px 26px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
  fontSize: 15, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
  display: 'inline-block', transition: 'transform 0.15s, opacity 0.2s',
}

export function Hero() {
  return (
    <section id="home" style={{ padding: '48px 24px 24px' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', background: 'var(--bg-elev)',
        border: '1px solid var(--border)', borderRadius: 28, overflow: 'hidden',
        boxShadow: 'var(--shadow)', position: 'relative',
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        alignItems: 'center', gap: 24,
      }} className="hero-grid">
        {/* accent glow */}
        <div aria-hidden style={{
          position: 'absolute', right: '8%', top: '20%', width: 340, height: 340,
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.28, filter: 'blur(30px)', pointerEvents: 'none',
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
            }}>Full-Stack &amp; AI Developer</p>
          </Reveal>
          <Reveal delay={0.16}>
            <p style={{
              margin: '20px 0 0', maxWidth: 460, fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, lineHeight: 1.7, color: 'var(--fg-muted)',
            }}>
              I'm a Computer Engineering student who builds modern full-stack web
              applications with React, Node.js, and MongoDB, and integrates AI into
              real-world products.
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
        <div style={{ position: 'relative', alignSelf: 'stretch', minHeight: 420 }} className="hero-photo">
          <img src={portrait} alt="John Moises" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
            filter: 'grayscale(0.4) sepia(0.55) saturate(1.35) hue-rotate(-12deg) contrast(1.02)',
          }} />
          {/* coffee duotone + fade into the card */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, var(--bg-elev) 0%, transparent 22%), linear-gradient(0deg, var(--bg-elev) 2%, transparent 30%), radial-gradient(circle at 60% 40%, rgba(200,135,79,0.22), transparent 60%)',
            mixBlendMode: 'normal',
          }} />
        </div>
      </div>
    </section>
  )
}
