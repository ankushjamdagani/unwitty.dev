function assert(condition: unknown, msg?: string): asserts condition {
  if (condition === false) throw new Error(msg);
}

type NegativeNumber = number & { __brand: "NegativeNumber" };

export const negativeNumberSchema = (value: number): NegativeNumber => {
  assert(value < 0, "Not a negative number");
  return value as NegativeNumber;
};

export enum Rotation {
  "0Deg",
  "90Deg",
  "180Deg",
  "270Deg",
}

export enum MovementDirection {
  LEFT,
  RIGHT,
  DOWN,
}
