import { Rotation, Shape2D } from './Tetris.types';

const NextRotation = {
  [Rotation['0deg']]: Rotation['90deg'],
  [Rotation['90deg']]: Rotation['180deg'],
  [Rotation['180deg']]: Rotation['270deg'],
  [Rotation['270deg']]: Rotation['0deg'],
}

export function getNextRotation(current: Rotation): Rotation {
  return NextRotation[current]
}

export function rotate(shape: Shape2D, rotation: Rotation): Shape2D {
  return shape
}