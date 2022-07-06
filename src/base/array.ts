export function createArrayWithProxy<T = unknown>(array: T[], trap?: (...values: T[]) => void) {
  return new Proxy(array, {
    get(target, prop: string) {
      // @ts-ignore
      const val = target[prop];
      if (typeof val === 'function') {
        if (['push', 'unshift'].includes(prop)) {
          return function() {
            if (trap) {
              trap(...arguments);
            }
            // @ts-ignore
            return Array.prototype[prop].apply(target, arguments);
          };
        }

        if (['pop'].includes(prop)) {
          return function() {
            // @ts-ignore
            const el = Array.prototype[prop].apply(target, arguments);
            if (trap) {
              trap(...arguments);
            }
            return el;
          };
        }

        return val.bind(target);
      }

      return val;
    },
  });
}

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
