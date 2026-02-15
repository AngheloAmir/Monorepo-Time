import '@fortawesome/fontawesome-free/css/all.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import config from 'config';
import App    from './App.tsx'

// Browser detection for color correction
//For some reason, chrome can produce different colors than other browsers
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
if (isChrome) {
  document.documentElement.classList.add('is-chrome');
} 

if (!config.isDev) {
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
