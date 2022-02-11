import { MObject } from '@/core/objects/MObject';
import { toPixel } from '@/base/dom';
import { MRow } from '@/core/objects/MRow';
import { mRowToGutterElement } from '@/core/renderer/renderer';

export class MEditorGutter extends MObject {
  private gutterEl: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    super();
  }

  public renderRows(rows: readonly MRow[]): void {
    const { gutterEl } = this;

    const children = Array.from(gutterEl.children);

    children.forEach((child) => gutterEl.removeChild(child));
    rows.forEach((row) => gutterEl.appendChild(mRowToGutterElement(row)));
  }

  public init(): void {
    const { root } = this;

    const gutterElement = document.createElement('div');
    gutterElement.style.width = toPixel(42);
    gutterElement.style.height = toPixel(root.offsetHeight);
    gutterElement.classList.add('m-editor__gutter')

    this.gutterEl = gutterElement;

    root.appendChild(gutterElement);
  }
}
