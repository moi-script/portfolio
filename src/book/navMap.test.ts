import { describe, it, expect } from 'vitest'
import { SPREADS, pageForSection, sectionForPage } from './navMap'

describe('SPREADS', () => {
  it('starts at cover and ends at back', () => {
    expect(SPREADS[0]).toBe('cover')
    expect(SPREADS[SPREADS.length - 1]).toBe('back')
  })
  it('contains the five nav sections', () => {
    for (const s of ['intro', 'story', 'work', 'about', 'contact'] as const) {
      expect(SPREADS).toContain(s)
    }
  })
})

describe('pageForSection', () => {
  it('returns the first spread index for a section', () => {
    expect(pageForSection('intro')).toBe(SPREADS.indexOf('intro'))
    expect(pageForSection('work')).toBe(SPREADS.indexOf('work'))
    expect(pageForSection('story')).toBe(SPREADS.indexOf('story'))
  })
})

describe('sectionForPage', () => {
  it('maps a page index back to its section', () => {
    expect(sectionForPage(0)).toBe('cover')
    expect(sectionForPage(SPREADS.indexOf('about'))).toBe('about')
  })
  it('clamps out-of-range indices', () => {
    expect(sectionForPage(-5)).toBe('cover')
    expect(sectionForPage(999)).toBe('back')
  })
})
