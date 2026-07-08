export function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v
}

/**
 * Global scroll progress runs 0…N. Page `pageIndex` turns as progress crosses
 * pageIndex → pageIndex+1. Returns this page's turn amount in [0,1].
 */
export function pageProgressToTurn(progress: number, pageIndex: number): number {
  return clamp(progress - pageIndex, 0, 1)
}

/** Smoothstep ease, [0,1] → [0,1], symmetric about 0.5. */
export function easeSettle(t: number): number {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

/** Nearest settled integer spread for a fractional progress. */
export function nearestSpread(progress: number): number {
  return Math.round(progress)
}
