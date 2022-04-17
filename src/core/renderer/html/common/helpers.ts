import { toPixel } from '@/base/dom';
import { IMRow } from '@/core/objects/MAbstractFactory';

export interface IDOMPosition {
  left: number;
  top: number;
}

const lineHeight = 16;

export const BASE_INDENT_VALUE = '    ';
export const _endl = '\n';

export function createSelectionRowElement(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('m-editor__selection-row');
  element.style.height = toPixel(lineHeight);

  return element;
}

export function mRowToBodyElement(row: IMRow): HTMLElement {
  const { index } = row;

  const element = document.createElement('span');
  element.textContent = `${index}`;
  element.classList.add('m-editor__body-cell');
  element.style.height = toPixel(lineHeight);

  return element;
}
