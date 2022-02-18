import { toPixel } from '@/base/dom';
import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { IRendererGutter } from '@/core/renderer/renderer';
import { MRow } from '@/core/objects/MRow';
import { MHTMLRenderer } from '@/core';
import { mRowToGutterElement } from '@/core/renderer/html/common/helpers';

export class MHTMLEditorGutter extends MDomObject implements IRendererGutter {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  private init(): void {
    const { renderer: { root } } = this;

    const gutterElement = document.createElement('div');
    gutterElement.style.width = toPixel(42);
    gutterElement.classList.add('m-editor__gutter')

    this._el = gutterElement;
    root.appendChild(gutterElement);
  }

  public onAddRow(row: MRow): void {
    this.el.appendChild(mRowToGutterElement(row));
  }
}
