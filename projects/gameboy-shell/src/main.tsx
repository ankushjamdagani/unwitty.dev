import React from 'react'
import ReactDOM from 'react-dom/client'

import { GameboyShell } from './GameboyShell.jsx'

import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameboyShell />
  </React.StrictMode>,
)
