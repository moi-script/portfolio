import { createRoot } from 'react-dom/client'
import './index.css'
import './theme/tokens.css'
import { ThemeProvider } from './theme/ThemeContext'
import App from './App.tsx'
// NOTE: StrictMode intentionally omitted — in dev it double-mounts the
// react-three-fiber <Canvas>, creating a second WebGL context that can trigger
// "THREE.WebGLRenderer: Context Lost" on integrated GPUs.
createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
