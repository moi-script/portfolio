import { Footer } from './components/Footer'
import { Home } from './sections/Home'
import { About } from './sections/About'
import { GitHub } from './sections/GitHub'
import { Timeline } from './sections/Timeline'
import { Contact } from './sections/Contact'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', overflowX: 'hidden' }}>
      <main>
        {/* Landing: everything important on one screen */}
        <Home />
        {/* More detail for anyone who scrolls */}
        <About />
        <GitHub />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
