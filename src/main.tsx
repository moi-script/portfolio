import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme/tokens.css'
import { ThemeProvider } from './theme/ThemeContext'
// import App from './App.tsx'
// import MoiPortfolio from './App.tsx'
import MoiPortfolio from './Moi.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MoiPortfolio />
    </ThemeProvider>
  </StrictMode>
)
