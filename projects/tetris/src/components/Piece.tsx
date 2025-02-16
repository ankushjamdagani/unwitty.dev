import { PieceRotation } from "../constants";

export enum PieceType {
  "I", // hero
  "J", // blue ricky
  "L", // orange ricky
  "O", // smashboy
  "T", // teewee
  "S", // rhode island
  "Z", // cleveland
}

export interface PieceProps {
  type: PieceType;
  rotation: PieceRotation;
  // position of top-left
  position: [number, number];
  // color?: ThemeConfig["pieceColors"];
}

export function Piece(props: PieceProps) {
  return <div>
    <h2>Piece Data</h2>
    <pre>{JSON.stringify(props, undefined, 4)}</pre>
  </div>;
}
