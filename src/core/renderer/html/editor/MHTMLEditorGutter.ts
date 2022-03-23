import { toPixel } from '@/base/dom';
import { MHTMLRenderer } from '@/core';
import { mRowToGutterElement } from '@/core/renderer/html/common/helpers';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLEditorGutter extends MHTMLGlyphDOM {
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

    this.registerListeners();
  }

  private registerListeners(): void {
    const { storage } = this.renderer;

    storage.onDidAddRow((row) => {
      this.el.appendChild(mRowToGutterElement(row));
    })
  }
}
