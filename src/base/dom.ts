export function toPixel(pixels: number): string {
  return `${pixels}px`;
}

export function removeChildren(element: HTMLElement): void {
  Array.from(element.children).forEach((element) => element.remove());
}
