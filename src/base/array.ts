/**
 * @param {string[]} array
 */
export function sortStrings(array: string[]): void {
  array.sort((a, b) => {
    if (a < b) {
      return -1;
    }

    if (a > b) {
      return 1;
    }

    return 0;
  })
}

/**
 * @param {number} index
 * @returns {boolean}
 */
export function indexOutOfRange(index: number): boolean {
  return index < 0;
}
