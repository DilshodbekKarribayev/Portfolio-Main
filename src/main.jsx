import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'devices.css/dist/devices.min.css'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
