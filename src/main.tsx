import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // 改为 BrowserRouter
import App from './App'
import './styles/global.css'
import 'highlight.js/styles/github-dark.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>  {/* 替换 HashRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)