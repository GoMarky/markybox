import { MRow } from '@/core/objects/MRow';
import { toPixel } from '@/base/dom';


export interface IDOMPosition {
  left: number;
  top: number;
}

export function mRowToGutterElement(row: MRow): HTMLElement {
  const { index } = row;

  const element = document.createElement('span');
  element.textContent = `${index}`;
  element.classList.add('m-editor__gutter-cell');
  element.style.height = toPixel(19);

  return element;
}

export function mRowToBodyElement(row: MRow): HTMLElement {
  const { index } = row;

  const element = document.createElement('span');
  element.textContent = `${index}`;
  element.classList.add('m-editor__gutter-cell');
  element.style.height = toPixel(19);

  return element;
}
