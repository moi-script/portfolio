export type SectionId =
  | 'cover'
  | 'intro'
  | 'ledger'
  | 'story'
  | 'work'
  | 'about'
  | 'contact'
  | 'back'

/** Ordered list of spreads. Index === page index used by the book. */
export const SPREADS: readonly SectionId[] = [
  'cover',
  'intro',
  'ledger',
  'story', // acts 01–02
  'story', // acts 03–04
  'work',
  'about',
  'contact',
  'back',
] as const

export function pageForSection(section: SectionId): number {
  const i = SPREADS.indexOf(section)
  return i < 0 ? 0 : i
}

export function sectionForPage(page: number): SectionId {
  const clamped = Math.max(0, Math.min(SPREADS.length - 1, Math.round(page)))
  return SPREADS[clamped]
}
