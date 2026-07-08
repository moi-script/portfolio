import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { Work } from './sections/Work'
import { Contributions } from './sections/Contributions'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <Nav />
      <Hero />
      <Story />
      <Work />
      <Contributions />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}
