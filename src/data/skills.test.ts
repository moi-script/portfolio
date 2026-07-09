import { describe, it, expect } from 'vitest'
import { skillGroups } from './skills'

describe('skillGroups', () => {
  it('has five non-empty categories with unique names', () => {
    expect(skillGroups).toHaveLength(5)
    const names = skillGroups.map((g) => g.category)
    expect(new Set(names).size).toBe(5)
    for (const g of skillGroups) {
      expect(g.items.length).toBeGreaterThan(0)
    }
  })
})
