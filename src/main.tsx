import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import SecurityMonitor from './components/SecurityMonitor.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SecurityMonitor>
      <App />
    </SecurityMonitor>
  </StrictMode>,
)
