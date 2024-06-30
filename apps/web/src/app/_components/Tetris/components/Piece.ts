import { useEffect, useContext, useCallback } from 'react';

import type { Rotation, Shape2D, Vector2D } from '../Tetris.types';
import { rotate } from '../Tetris.helpers';

import { CanvasContext } from './Canvas';

enum PieceType {
  "L",
  "BOX",
  "LINE",
  "Z"
}

type PieceProps = {
  type: PieceType,
  rotation: Rotation,
  position: Vector2D,
  color: number
}

// @ts-ignore
const PiecePixelData: Record<PieceType, Shape2D> = {
  [PieceType.L]: [
    [1,0,0],
    [1,1,1],
    [0,0,0],
  ],
}

// @ts-ignore
export function getRandomPiece(): PieceProps {
}

export function Piece(props: PieceProps): void {
  const { position, rotation, type, color } = props;
  const { drawPixel } = useContext(CanvasContext);

  const draw = useCallback((piece: Shape2D) => {
    // draw all pixels of piece
    for(let i = 0; i < piece.length; i++) {
      const row = piece[i];

      for(let j = 0; j < row.length; j++) {
        const x = position[0] + j;
        const y = position[1] + i;

        drawPixel([x, y], color);
      }
    }
  }, [])

  useEffect(() => {
    const piece = PiecePixelData[type];
    const rotatedPiece = rotate(piece, rotation);

    draw(rotatedPiece);
  }, [type, rotation])

  return null;
}
