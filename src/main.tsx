import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'  // 改回 HashRouter
import App from './App'
import './styles/global.css'
import 'highlight.js/styles/github-dark.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>  {/* 使用 HashRouter */}
      <App />
    </HashRouter>
  </StrictMode>,
)