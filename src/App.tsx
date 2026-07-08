import { Suspense, lazy } from 'react'
import { useBookMode } from './book/useBookMode'
import { FallbackBook } from './book/FallbackBook'

const BookCanvas = lazy(() =>
  import('./book/BookCanvas').then((m) => ({ default: m.BookCanvas })),
)

export default function App() {
  const mode = useBookMode()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--room-bg)', overflowX: 'hidden' }}>
      {mode === 'webgl' ? (
        <Suspense fallback={<div style={{ height: '100vh' }} />}>
          <BookCanvas />
        </Suspense>
      ) : (
        <FallbackBook />
      )}
    </div>
  )
}
