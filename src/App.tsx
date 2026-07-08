import { useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Story } from './sections/Story'
import { Work } from './sections/Work'
import { Contributions } from './sections/Contributions'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import HireMeModal from './Hire'

export default function App() {
  const [hireOpen, setHireOpen] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <Nav onHireClick={() => setHireOpen(true)} />
      <Hero />
      <Story />
      <Work />
      <Contributions />
      <About />
      <Contact onHireClick={() => setHireOpen(true)} />
      <Footer />
      <HireMeModal isOpen={hireOpen} onClose={() => setHireOpen(false)} />
    </div>
  )
}
