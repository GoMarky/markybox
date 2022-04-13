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

export function getLastElement<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }

  return array.at(-1);
}
