import { Rotation } from "../types/common";

export function numberInRange(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value));
}

export function rotateMatrix<T>(matrix: T[][], rotation: Rotation): T[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0; // Handle empty matrix case

  if (rows === 0 || cols === 0) return matrix; // Return early if the matrix is empty

  let rotated: T[][];

  switch (rotation) {
    // 0°: Returns the original matrix.
    case Rotation["0Deg"]:
      return matrix; // No rotation, return as is

    // 90°: Flips dimensions (cols x rows) and rotates elements accordingly.
    case Rotation["90Deg"]:
      rotated = Array.from({ length: cols }, () => Array(rows));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // @ts-ignore
          rotated[j][rows - 1 - i] = matrix[i][j];
        }
      }
      return rotated;

    // 180°: Reverses both row and column positions.
    case Rotation["180Deg"]:
      rotated = Array.from({ length: rows }, () => Array(cols));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // @ts-ignore
          rotated[rows - 1 - i][cols - 1 - j] = matrix[i][j];
        }
      }
      return rotated;

    // 270°: Similar to 90° but rotates counterclockwise.
    case Rotation["270Deg"]:
      rotated = Array.from({ length: cols }, () => Array(rows));
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // @ts-ignore
          rotated[cols - 1 - j][i] = matrix[i][j];
        }
      }
      return rotated;

    default:
      throw new Error(
        "Invalid rotation angle. Allowed values: 0, 90, 180, 270."
      );
  }
}
