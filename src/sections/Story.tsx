import { acts } from '../data/story'
import { StoryAct } from './StoryAct'
import { Reveal } from '../components/Reveal'

export function Story() {
  return (
    <section id="story" style={{ position: 'relative' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '80px 48px 0' }}>
        <Reveal>
          <p style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-2)', margin: '0 0 8px' }}>// The build log</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 'clamp(26px,4vw,44px)', color: 'var(--fg)', margin: 0, letterSpacing: '-0.02em' }}>From C++ to shipping systems.</h2>
        </Reveal>
      </div>
      {acts.map(a => <StoryAct key={a.id} act={a} />)}
    </section>
  )
}
