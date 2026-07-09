import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveSection } from './useActiveSection'

type Cb = (entries: Array<{ target: { id: string }; isIntersecting: boolean; intersectionRatio: number }>) => void
let lastCb: Cb

beforeEach(() => {
  lastCb = () => {}
  class IO {
    constructor(cb: Cb) { lastCb = cb }
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('IntersectionObserver', IO as unknown as typeof IntersectionObserver)
  // getElementById returns a stub element carrying its id
  vi.spyOn(document, 'getElementById').mockImplementation((id: string) => ({ id }) as HTMLElement)
})

describe('useActiveSection', () => {
  it('defaults to the first id', () => {
    const { result } = renderHook(() => useActiveSection(['home', 'about']))
    expect(result.current).toBe('home')
  })

  it('updates when a section becomes active', () => {
    const { result } = renderHook(() => useActiveSection(['home', 'about']))
    act(() => {
      lastCb([{ target: { id: 'about' }, isIntersecting: true, intersectionRatio: 0.9 }])
    })
    expect(result.current).toBe('about')
  })
})
