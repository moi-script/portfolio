import { describe, it, expect } from 'vitest'
import { skillGroups } from './skills'
import { skillIcons } from './skillIcons'

describe('skillIcons', () => {
  it('has a logo mapping for every skill listed in skillGroups', () => {
    const missing: string[] = []
    for (const group of skillGroups) {
      for (const item of group.items) {
        if (!skillIcons[item]) missing.push(item)
      }
    }
    expect(missing).toEqual([])
  })
})
