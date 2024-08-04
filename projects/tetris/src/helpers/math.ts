export function numberInRange(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value));
}
