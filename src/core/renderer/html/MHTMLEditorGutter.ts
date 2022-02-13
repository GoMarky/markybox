import { toPixel } from '@/base/dom';
import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererGutter } from '@/core/renderer/renderer';
import { MRow } from '@/core/objects/MRow';
import { mRowToGutterElement } from '@/core/renderer/html/helpers';

export class MHTMLEditorGutter extends MDomObject implements IRendererGutter {
  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  private init(): void {
    const { root } = this;

    const gutterElement = document.createElement('div');
    gutterElement.style.width = toPixel(42);
    gutterElement.classList.add('m-editor__gutter')

    this._el = gutterElement;
    root.appendChild(gutterElement);
  }

  public addRow(row: MRow): void {
    this.el.appendChild(mRowToGutterElement(row));
  }
}
