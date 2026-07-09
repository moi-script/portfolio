import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeCtx { theme: Theme; toggle: () => void }
const Ctx = createContext<ThemeCtx | null>(null)

function initialTheme(): Theme {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('moi-theme') : null
  return stored === 'dark' ? 'dark' : 'light' // light-first; ignore system
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('moi-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- co-located hook, pre-existing from theme setup (Task 3)
export function useTheme(): ThemeCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useTheme must be used within ThemeProvider')
  return v
}
