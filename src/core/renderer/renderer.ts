import { IDisplayRenderer } from '@/core/renderer/html/MHTMLRenderer';
import { MEditorGutter } from '@/core/renderer/html/MEditorGutter';
import { MRow } from '@/core/objects/MRow';
import { toPixel } from '@/base/dom';
import { MEditorBody } from '@/core/renderer/html/MEditorBody';

export function mRowToGutterElement(row: MRow): HTMLElement {
  const { index } = row;

  const element = document.createElement('span');
  element.textContent = `${index}`;
  element.classList.add('m-editor__gutter-cell');
  element.style.height = toPixel(19);

  return element;
}

export interface IAbstractRenderer {
  readonly gutter: MEditorGutter;
  readonly body: MEditorBody;
  readonly display: IDisplayRenderer;

  render(): void;
}
