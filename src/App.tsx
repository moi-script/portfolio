import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { GitHub } from './sections/GitHub'
import { Timeline } from './sections/Timeline'
import { Contact } from './sections/Contact'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', overflowX: 'hidden' }}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GitHub />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
