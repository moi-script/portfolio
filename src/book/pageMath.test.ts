import { describe, it, expect } from 'vitest'
import { clamp, pageProgressToTurn, easeSettle, nearestSpread } from './pageMath'

describe('clamp', () => {
  it('clamps below, within, above', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(99, 0, 10)).toBe(10)
  })
})

describe('pageProgressToTurn', () => {
  it('page not yet reached is flat (0)', () => {
    expect(pageProgressToTurn(0.0, 2)).toBe(0)
    expect(pageProgressToTurn(1.9, 2)).toBe(0)
  })
  it('page fully turned once progress passes it', () => {
    expect(pageProgressToTurn(3.0, 2)).toBe(1)
    expect(pageProgressToTurn(5.0, 2)).toBe(1)
  })
  it('page mid-turn returns the fractional progress', () => {
    expect(pageProgressToTurn(2.25, 2)).toBeCloseTo(0.25, 5)
    expect(pageProgressToTurn(2.75, 2)).toBeCloseTo(0.75, 5)
  })
})

describe('easeSettle', () => {
  it('pins endpoints and is monotonic in the middle', () => {
    expect(easeSettle(0)).toBe(0)
    expect(easeSettle(1)).toBe(1)
    expect(easeSettle(0.5)).toBeCloseTo(0.5, 5)
    expect(easeSettle(0.25)).toBeLessThan(0.25)
  })
})

describe('nearestSpread', () => {
  it('rounds to the nearest integer spread', () => {
    expect(nearestSpread(2.2)).toBe(2)
    expect(nearestSpread(2.6)).toBe(3)
    expect(nearestSpread(0.49)).toBe(0)
  })
})
