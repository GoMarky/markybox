import { MRow } from '@/core/objects/MGlyphRow';
import { toPixel } from '@/base/dom';


export interface IDOMPosition {
  left: number;
  top: number;
}

const lineHeight = 16;

export function mRowToGutterElement(row: MRow): HTMLElement {
  const { index } = row;

  const element = document.createElement('span');
  element.textContent = `${index}`;
  element.classList.add('m-editor__gutter-cell');
  element.style.height = toPixel(lineHeight);

  return element;
}

export function createSelectionRowElement(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('m-editor__selection-row');
  element.style.height = toPixel(lineHeight);

  return element;
}

export function mRowToBodyElement(row: MRow): HTMLElement {
  const { index } = row;

  const element = document.createElement('span');
  element.textContent = `${index}`;
  element.classList.add('m-editor__body-cell');
  element.style.height = toPixel(lineHeight);

  return element;
}
