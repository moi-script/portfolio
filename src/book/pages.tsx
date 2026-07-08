import type { ReactNode } from 'react'
import type { SectionId } from './navMap'
import { SPREADS } from './navMap'
import { IntroContent } from './content/IntroContent'
import { LedgerContent } from './content/LedgerContent'
import { StoryContent } from './content/StoryContent'
import { WorkContent } from './content/WorkContent'
import { AboutContent } from './content/AboutContent'
import { ContactContent } from './content/ContactContent'

export interface PageDef {
  section: SectionId
  render: (onNavigate?: (s: SectionId) => void) => ReactNode | null
}

// One renderer per SPREADS index, in order. The two 'story' spreads differ by part.
let storyPart = 0
export const PAGES: PageDef[] = SPREADS.map((section): PageDef => {
  switch (section) {
    case 'intro':
      return { section, render: (onNavigate) => <IntroContent onNavigate={onNavigate} /> }
    case 'ledger':
      return { section, render: () => <LedgerContent /> }
    case 'story': {
      storyPart += 1
      const part = storyPart as 1 | 2
      return { section, render: () => <StoryContent part={part} /> }
    }
    case 'work':
      return { section, render: () => <WorkContent /> }
    case 'about':
      return { section, render: () => <AboutContent /> }
    case 'contact':
      return { section, render: () => <ContactContent /> }
    default: // cover, back
      return { section, render: () => null }
  }
})
