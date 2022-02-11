import { MObject } from '@/core/objects/MObject';
import { toPixel } from '@/base/dom';
import { MRow } from '@/core/objects/MRow';

export class MGutter extends MObject {
  private gutterEl: HTMLElement;

  constructor(private readonly root: HTMLElement) {
    super();
  }

  public renderRows(rows: readonly MRow[]): void {
    const { gutterEl } = this;

    const children = Array.from(gutterEl.children);

    children.forEach((child) => gutterEl.removeChild(child));
    rows.forEach((row) => gutterEl.appendChild(row.element));
  }

  public init(): void {
    const { root } = this;

    const gutterElement = document.createElement('div');
    gutterElement.style.width = toPixel(42);
    gutterElement.style.height = toPixel(root.offsetHeight);
    gutterElement.classList.add('m-gutter')

    this.gutterEl = gutterElement;

    root.appendChild(gutterElement);
  }
}
