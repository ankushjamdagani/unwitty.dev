import { Piece } from "./Piece";

type BoardProps = {
  children: (typeof Piece)[]
}

export function Board(props: BoardProps): void {
  const { children } = props;

  return null;
}