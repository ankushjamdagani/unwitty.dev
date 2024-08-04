import { useCallback, useState } from "react";

export enum PieceType {
  I, // hero
  J, // blue ricky
  L, // orange ricky
  O, // smashboy
  T, // teewee
  S, // rhode island
  Z, // cleveland
}

// 90deg rotation
export enum PieceRotation {
  "0Deg",
  "90Deg",
  "180Deg",
  "270Deg",
}

const nextRotation = {
  [PieceRotation["0Deg"]]: PieceRotation["90Deg"],
  [PieceRotation["90Deg"]]: PieceRotation["180Deg"],
  [PieceRotation["180Deg"]]: PieceRotation["270Deg"],
  [PieceRotation["270Deg"]]: PieceRotation["0Deg"],
};

export enum PieceMovementDirection {
  LEFT,
  RIGHT,
  DOWN,
}

type Position = [number, number];

interface Piece {
  type: PieceType;
  rotation: PieceRotation;
  // position of top-left
  position: Position;
  // color?: ThemeConfig["pieceColors"];
}

interface PieceProps {
  defaultState?: {
    activePiece: Piece;
    nextPiece: Piece;
  };
  keepInRange: (position: Position) => Position;
}

const DefaultState = {
  activePiece: getRandomPiece(),
  nextPiece: getRandomPiece(),
};

function getRandomPiece(): Piece {
  const allPieces = Object.values(PieceType).filter(
    (val) => typeof val === "number"
  );
  const pieceType =
    allPieces[Math.floor(Math.random() * allPieces.length)] || PieceType.S;

  return {
    type: pieceType,
    rotation: PieceRotation["0Deg"],
    position: [0, 0],
  };
}

export function usePiece({
  defaultState = DefaultState,
  keepInRange,
}: PieceProps) {
  const [state, setState] = useState(() => defaultState);
  const { activePiece, nextPiece } = state;

  const setNextPiece = useCallback(() => {
    setState((state) => ({
      ...state,
      activePiece: state.nextPiece,
      nextPiece: getRandomPiece(),
    }));
  }, []);

  const rotatePiece = useCallback(() => {
    setState((state) => ({
      ...state,
      activePiece: {
        ...state.activePiece,
        rotation: nextRotation[state.activePiece.rotation],
      },
    }));
  }, []);

  const movePiece = useCallback((direction: PieceMovementDirection) => {
    setState((state) => {
      let { position } = state.activePiece;
      const newPosition: Position = [position[0], position[1]];

      switch (direction) {
        case PieceMovementDirection.LEFT:
          newPosition[0]--;
          break;
        case PieceMovementDirection.RIGHT:
          newPosition[0]++;
          break;
        case PieceMovementDirection.DOWN:
          newPosition[1]++;
          break;
      }

      return {
        ...state,
        activePiece: {
          ...state.activePiece,
          position: keepInRange(newPosition),
        },
      };
    });
  }, []);

  return {
    activePiece,
    nextPiece,
    setNextPiece,
    rotatePiece,
    movePiece,
  };
}
