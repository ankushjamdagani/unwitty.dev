import React, { useRef, useState, useCallback, useEffect, createContext } from 'react';

import type { Shape2D, Vector2D, Vector4D } from "../Tetris.types";
import { Board } from './Board';

/**
 * Attributes in this order [x, y, width, height]
 */
type RectangleProps = Vector4D

type CanvasProps = {
  canvas: any,
  resolution: Vector2D,
  styles: {
    fillColor?: string,
    strokeColor?: string,
    strokeWidth?: number
  },
  children: React.ReactNode
}

export const CanvasContext = createContext(null)

export function Canvas(props: CanvasProps) {
  const { canvas, resolution, styles, children } = props;

  const canvasRef = useRef(null);
  const [context2D, setContext2D] = useState(() => canvas.getContext("2d") as CanvasRenderingContext2D)

  const getPixelBox = useCallback((position: Vector2D): RectangleProps => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const pixelWidth = canvasWidth / resolution[0]
    const pixelHeight = canvasHeight / resolution[1]

    return [
      position[0] * pixelWidth,
      position[1] * pixelHeight,
      pixelWidth,
      pixelHeight,
    ]
  }, [canvas, resolution])

  const drawPixel = useCallback((position: Vector2D, color: number) => {
    const { fillColor = "#000", strokeColor = "#000", strokeWidth = 1 } = styles;

    const pixelBox = getPixelBox(position);

    context2D.fillStyle = fillColor; // theme[name][pieceColor].fillColor
    context2D.strokeStyle = strokeColor; // theme[name][pieceColor].strokeColor
    context2D.lineWidth = strokeWidth; // fixed based on accessibility - screen-size

    context2D.beginPath();
    context2D.rect(...pixelBox);

    context2D.fill();
    context2D.stroke();
  }, [context2D, styles, getPixelBox])

  const drawGrid = useCallback((shape: Shape2D, position: Vector2D) => {
    // draw all pixels of shape
    for(let i = 0; i < shape.length; i++) {
      const row = shape[i];

      for(let j = 0; j < row.length; j++) {
        const cell = row[j];
        const x = position[0] + j;
        const y = position[1] + i;

        drawPixel([x, y], cell);
      }
    }
  }, [])

  const clear = useCallback(() => {
    context2D.clearRect(0, 0, canvas.width, canvas.height)
  }, [canvas, context2D])

  // useImperitiveHandle to bind component methods to ref

  useEffect(() => {
    setContext2D(canvas.getContext("2d") as CanvasRenderingContext2D)
  }, [canvas])

  return <>
    <canvas ref={canvasRef} id={id} onClick={setNextOrientation} />
    <CanvasContext.Provider value={{ drawPixel }}>{children}</CanvasContext.Provider>
  </>;
}