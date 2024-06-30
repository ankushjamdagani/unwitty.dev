import { useState, useRef, useEffect } from "react";

import "./Tetris.styles.css";

import { TetrisPiece } from "./Canvas";

export function Tetris() {
  const canvasRef = useRef(null);
  const tetrisRef = useRef(null);

  const [orientation, setOrientation] = useState([1, 1]);

  function initCanvas() {
    // Get the DPR and size of the canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    
    const dpr = window.devicePixelRatio;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.imageSmoothingEnabled = false

    // // Set the "actual" size of the canvas
    // canvas.width = width * dpr;
    // canvas.height = height * dpr;

    // // Set the "drawn" size of the canvas
    // canvas.style.width = `${width}px`;
    // canvas.style.height = `${height}px`;

    // // Scale the context to ensure correct drawing operations
    // ctx.scale(dpr, dpr);
  }

  function initTetris() {
    tetrisRef.current = new TetrisPiece({
      canvas: canvasRef.current,
      resolution: [20, 15],
      styles: {
        fillColor: "black",
        strokeColor: "white",
        // strokeWidth: 2,
      }
    })
  }

  function setNextOrientation() {
    console.log('--------')
    setOrientation(orientation => TetrisPiece.getNextOrientation(orientation))
  }

  useEffect(() => {
    if(canvasRef.current) {
      initCanvas();
      initTetris();
    }
  }, [])

  useEffect(() => {
    if(tetrisRef.current) {
      tetrisRef.current.clear()
      console.log('orientation', orientation)
      tetrisRef.current.drawL([4, 5], orientation)
    }
  }, [orientation])

  return <>
    
  </>
}