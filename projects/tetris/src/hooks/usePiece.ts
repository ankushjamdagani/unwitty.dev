import { useCallback, useState } from "react";
import { Resolution } from "../constants";
import { numberInRange, rotateMatrix } from "../helpers/math";
import { MovementDirection, Rotation } from "../types/common";

export enum PieceType {
  I, // hero
  J, // blue ricky
  L, // orange ricky
  O, // smashboy
  T, // teewee
  S, // rhode island
  Z, // cleveland
}

const nextRotation = {
  [Rotation["0Deg"]]: Rotation["90Deg"],
  [Rotation["90Deg"]]: Rotation["180Deg"],
  [Rotation["180Deg"]]: Rotation["270Deg"],
  [Rotation["270Deg"]]: Rotation["0Deg"],
};

export type PiecePosition = [number, number];

export interface Piece {
  type: PieceType;
  rotation: Rotation;
  // position of top-left
  position: PiecePosition;
  // color?: ThemeConfig["pieceColors"];
}

interface PieceProps {
  defaultState?: {
    activePiece: Piece | null;
    nextPiece: Piece;
  };
  resolution: Resolution;
}

const DefaultState = {
  activePiece: null,
  nextPiece: getRandomPiece(),
};

const PieceShape = {
  [PieceType.I]: [[1], [1], [1]],
  [PieceType.J]: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  [PieceType.L]: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [PieceType.O]: [
    [1, 1],
    [1, 1],
  ],
  [PieceType.S]: [
    [0, 1, 1],
    [0, 1, 0],
    [1, 1, 0],
  ],
  [PieceType.T]: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [PieceType.Z]: [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
};

export function getPiecePixels(piece: Piece) {
  const baseShape = PieceShape[piece.type];
  return rotateMatrix(baseShape, piece.rotation);
}

function getRandomPiece(): Piece {
  const allPieces = Object.values(PieceType).filter(
    (val) => typeof val === "number"
  );
  const pieceType =
    allPieces[Math.floor(Math.random() * allPieces.length)] || PieceType.S;

  return {
    type: pieceType,

    rotation: Rotation["0Deg"],
    position: [0, 0],
  };
}

function keepInRange(
  position: [number, number],
  resolution: Resolution
): [number, number] {
  return [
    numberInRange(-resolution / 2, resolution / 2, position[0]),
    // TODO: y-axis range is between 0 and next heap cell
    numberInRange(0, resolution, position[1]),
  ];
}

export function usePiece({
  defaultState = DefaultState,
  resolution,
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

      activePiece: state.activePiece
        ? {
            ...state.activePiece,
            rotation: nextRotation[state.activePiece.rotation],
          }
        : null,
    }));
  }, []);

  const movePiece = useCallback(
    (direction: MovementDirection) => {
      setState((state) => {
        if (!state.activePiece) return state;

        let { position } = state.activePiece;
        const newPosition: PiecePosition = [position[0], position[1]];

        switch (direction) {
          case MovementDirection.LEFT:
            newPosition[0]--;
            break;
          case MovementDirection.RIGHT:
            newPosition[0]++;
            break;
          case MovementDirection.DOWN:
            newPosition[1]++;
            break;
        }

        return {
          ...state,
          activePiece: {
            ...state.activePiece,
            position: keepInRange(newPosition, resolution),
          },
        };
      });
    },
    [resolution]
  );

  const reset = useCallback(() => {
    setState(DefaultState);
  }, []);

  return {
    activePiece,
    nextPiece,
    setNextPiece,
    rotatePiece,
    movePiece,
    reset,
  };
}
