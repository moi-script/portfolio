import { useEffect, useState } from 'react'
import { FiEye } from 'react-icons/fi'

// Free hosted counter (no signup): abacus.jasoncameron.dev
//  - /hit/<ns>/<key>  increments then returns the value
//  - /get/<ns>/<key>  returns the value without changing it
const ABACUS = 'https://abacus.jasoncameron.dev'
const NS = 'johnmoises-portfolio'
const KEY = 'site-views'
const FLAG = 'pv_counted' // localStorage: this device has already been counted

export function ViewCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    // A device counts exactly once, ever. Refreshes and return visits only read.
    // Flag is set synchronously so a refresh (or React StrictMode's double effect)
    // can't produce a second increment.
    const counted = localStorage.getItem(FLAG) === '1'
    if (!counted) localStorage.setItem(FLAG, '1')
    const endpoint = counted ? 'get' : 'hit'

    fetch(`${ABACUS}/${endpoint}/${NS}/${KEY}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { value: number }) => {
        if (!cancelled) setCount(data.value)
      })
      .catch(() => {
        /* network/service down — stay hidden rather than show a broken counter */
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Nothing to show until we have a real number.
  if (count === null) return null

  return (
    <span
      title={`${count.toLocaleString()} unique visitors`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: 'var(--fg-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: 14,
      }}
    >
      <FiEye aria-hidden size={15} />
      <span>{count.toLocaleString()}</span>
    </span>
  )
}
