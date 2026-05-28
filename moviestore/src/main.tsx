import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'primereact/resources/themes/lara-light-blue/theme.css'; // motyw
import 'primereact/resources/primereact.min.css';               // core styles
import 'primeicons/primeicons.css';  
import 'primereact/resources/primereact.css';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>,
  </BrowserRouter>
)
