export function toPixel(pixels: number): string {
  return `${pixels}px`;
}

export function removeChildren(element: HTMLElement): void {
  Array.from(element.children).forEach((element) => element.remove());
}

export type KnownLocalStorageKey = 'sessionId';

export function getLocalStorageItem<T>(key: KnownLocalStorageKey, defaultValue: T): T
export function getLocalStorageItem<T>(key: KnownLocalStorageKey, defaultValue?: T): T | null {
  const result = JSON.stringify(window.localStorage.getItem(key));

  if (result) {
    return JSON.parse(result);
  }

  if (defaultValue) {
    return defaultValue;
  }

  return null;
}

export function setLocalStorageItem(key: KnownLocalStorageKey, value: unknown): void {
  return window.localStorage.setItem(key, JSON.stringify(value));
}
