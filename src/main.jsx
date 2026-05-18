import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { PortfolioProvider } from './context/PortfolioContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

window.deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  window.dispatchEvent(new Event('pwa-prompt-ready'));
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PortfolioProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PortfolioProvider>
    </BrowserRouter>
  </StrictMode>,
)
