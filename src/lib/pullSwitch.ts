/** Downward drag velocity (px/s) that counts as a deliberate flick even on a short pull. */
export const VELOCITY_TRIGGER = 800

/** Decide whether a spider pull should toggle the theme. */
export function shouldToggle(pullDistance: number, velocity: number, threshold: number): boolean {
  return pullDistance >= threshold || velocity >= VELOCITY_TRIGGER
}
