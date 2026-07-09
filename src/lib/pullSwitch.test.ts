import { describe, it, expect } from 'vitest'
import { shouldToggle, VELOCITY_TRIGGER } from './pullSwitch'

describe('shouldToggle', () => {
  it('is false for a small slow pull', () => {
    expect(shouldToggle(40, 100, 60)).toBe(false)
  })
  it('is true exactly at the distance threshold', () => {
    expect(shouldToggle(60, 0, 60)).toBe(true)
  })
  it('is true well past the threshold', () => {
    expect(shouldToggle(120, 0, 60)).toBe(true)
  })
  it('is true for a fast flick even below the distance threshold', () => {
    expect(shouldToggle(20, VELOCITY_TRIGGER, 60)).toBe(true)
  })
  it('is false for a slow pull just under threshold and low velocity', () => {
    expect(shouldToggle(59, VELOCITY_TRIGGER - 1, 60)).toBe(false)
  })
})
