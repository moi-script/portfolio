import type { ReactNode } from 'react'

export function ParchmentCard({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div
      id={id}
      style={{
        maxWidth: 760,
        margin: '0 auto 28px',
        padding: 32,
        borderRadius: 16,
        background: 'var(--parchment)',
        border: '2px solid var(--gold-deep)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.5)',
        scrollMarginTop: 80,
      }}
    >
      {children}
    </div>
  )
}
