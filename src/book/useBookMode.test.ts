import { describe, it, expect } from 'vitest'
import { resolveBookMode } from './useBookMode'

describe('resolveBookMode', () => {
  it('uses cards on narrow screens', () => {
    expect(resolveBookMode(500, false)).toBe('cards')
    expect(resolveBookMode(819, false)).toBe('cards')
  })
  it('uses cards when reduced motion is requested, even on wide screens', () => {
    expect(resolveBookMode(1440, true)).toBe('cards')
  })
  it('uses the webgl book on wide screens without reduced motion', () => {
    expect(resolveBookMode(820, false)).toBe('webgl')
    expect(resolveBookMode(1920, false)).toBe('webgl')
  })
})
