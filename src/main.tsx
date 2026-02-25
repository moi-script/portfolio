import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import MoiPortfolio from './App.tsx'
import MoiPortfolio from './Moi.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MoiPortfolio />
  </StrictMode>
)
