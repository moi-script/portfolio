import { BookCanvas } from './book/BookCanvas'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--room-bg)', overflowX: 'hidden' }}>
      <BookCanvas />
    </div>
  )
}
