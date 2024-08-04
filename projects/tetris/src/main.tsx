import React from 'react'
import ReactDOM from 'react-dom/client'

import './main.css'

import { Tetris } from './Tetris'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Tetris />
  </React.StrictMode>,
)
