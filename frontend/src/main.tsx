import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Fondo global tipo delivery */}
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-yellow-100">
      <App />
    </div>
  </StrictMode>,
)