export function arrayOf(length: number): Array<number> {
  return Array.from({ length }, (_, index) => index)
}
