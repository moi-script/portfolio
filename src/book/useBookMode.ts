import { useEffect, useState } from 'react'

export type BookMode = 'webgl' | 'cards'

export const BOOK_MIN_WIDTH = 820

export function resolveBookMode(width: number, reducedMotion: boolean): BookMode {
  if (reducedMotion) return 'cards'
  if (width < BOOK_MIN_WIDTH) return 'cards'
  return 'webgl'
}

function readMode(): BookMode {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const width = typeof window !== 'undefined' ? window.innerWidth : 1440
  return resolveBookMode(width, reduced)
}

export function useBookMode(): BookMode {
  const [mode, setMode] = useState<BookMode>(readMode)

  useEffect(() => {
    const update = () => setMode(readMode())
    window.addEventListener('resize', update)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      mq.removeEventListener('change', update)
    }
  }, [])

  return mode
}
