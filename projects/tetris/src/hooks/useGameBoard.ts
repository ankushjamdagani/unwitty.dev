import { useCallback, useEffect, useState } from "react";
import { Resolution } from "../constants";
import { getPiecePixels, Piece } from "./usePiece";

type PixelEmpty = 0;
type PixelDisabled = -1;
type PixelColored = number; // positive numbers
// type PixelCorrupt = -number // negative numbers

type BoardPixel = PixelEmpty | PixelDisabled | PixelColored;

type Board = BoardPixel[][];

interface useGameBoardProps {
  defaultState?: {
    board: Board;
  };
  resolution: Resolution;
  tick: number;
}

const getInitialState = ({
  defaultState,
  resolution,
}: Pick<useGameBoardProps, "defaultState" | "resolution">) => ({
  ...(defaultState || {}),
  board:
    defaultState?.board ||
    Array.from({ length: resolution }, () =>
      Array.from({ length: resolution }, () => 0)
    ), // Pixel Empty)
});

export function useGameBoard({
  defaultState,
  resolution,
  tick,
}: useGameBoardProps) {
  const [state, setState] = useState(() =>
    getInitialState({ defaultState, resolution })
  );
  const { board } = state;

  const checkBoardCollision = useCallback(
    (activePiece: Piece) => {
      const boardRows = board.length;

      const piecePixels = getPiecePixels(activePiece);
      const pieceRows = piecePixels.length;
      const pieceCols = piecePixels[0]?.length || 0;
      const [positionX, positionY] = activePiece.position;

      // Check if moving down causes collision
      for (let i = 0; i < pieceRows; i++) {
        for (let j = 0; j < pieceCols; j++) {
          const pixel = piecePixels[i]![j];
          if (pixel) {
            const nextRow = positionY + i + 1; // move down
            const nextCol = positionX + j;

            if (nextRow >= boardRows) {
              return true;
            }

            // Check if we hit another block
            if (board[nextRow]![nextCol] === 1) {
              return true;
            }
          }
        }
      }

      return false;
    },
    [board]
  );

  const addToBoard = useCallback(
    (activePiece: Piece) => {
      const piecePixels = getPiecePixels(activePiece);
      const pieceRows = piecePixels.length;
      const pieceCols = piecePixels[0]?.length || 0;
      const [positionX, positionY] = activePiece.position;

      if (positionY + pieceRows > board.length) {
        return;
      }

      for (let i = 0; i < pieceRows; i++) {
        for (let j = 0; j < pieceCols; j++) {
          const pixel = piecePixels[i]![j];
          if (pixel) {
            const currRow = positionY + i;
            const currCol = positionX + j;
            if (!board[currRow] || board[currRow][currCol] == null) {
              continue;
            }
            board[currRow][currCol] = pixel;
          }
        }
        board[i] = [...board[i]!];
      }

      setState((state) => ({
        ...state,
        board: [...board],
      }));
    },
    [board]
  );

  const isPixelActive = (pixel: number): boolean => {
    return pixel > 0;
  };

  const getCollapsableRows = useCallback((board: Board) => {
    return board.reduce((collapsableRows, row, rowIndex) => {
      const isRowCollapsable = row.every((pixel: BoardPixel) =>
        isPixelActive(pixel)
      );

      if (isRowCollapsable) {
        collapsableRows.push(rowIndex);
      }
      return collapsableRows;
    }, [] as number[]);
  }, []);

  const collapseRows = useCallback((board: Board, rows: number[]) => {
    for (const rowIndex of rows) {
      delete board[rowIndex];
    }
    for (let rowIndex = board.length - 1; rowIndex > 0; rowIndex--) {
      const prevRow = board[rowIndex - 1];
      if (!board[rowIndex] && prevRow) {
        board[rowIndex] = prevRow;
      }
    }
  }, []);

  const isBoardHeightFilled = useCallback(() => {
    return board[0]?.some((pixel) => pixel > 0);
  }, [board]);

  const updateBoard = useCallback(() => {
    const collapsableRows = getCollapsableRows(board);
    if (!collapsableRows.length) {
      collapseRows(board, collapsableRows);
    }
  }, [board, getCollapsableRows, collapseRows]);

  const reset = useCallback(() => {
    setState(getInitialState({ resolution, defaultState }));
  }, [resolution, defaultState]);

  useEffect(() => {
    if (tick) {
      updateBoard();
    }
  }, [tick, updateBoard]);

  return {
    board,
    checkBoardCollision,
    addToBoard,
    isBoardHeightFilled,
    reset,
  };
}
