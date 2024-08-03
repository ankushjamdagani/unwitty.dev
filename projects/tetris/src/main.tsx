import React from 'react'
import ReactDOM from 'react-dom/client'

import { Tetris } from './Tetris'

import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Tetris />
  </React.StrictMode>,
)
