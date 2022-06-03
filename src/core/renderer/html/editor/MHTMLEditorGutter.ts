import * as dom from '@/base/dom';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLEditorGutter extends MHTMLGlyphDOM<HTMLDivElement> {
  constructor() {
    super();
  }

  public mount(root: HTMLElement): void {
    const gutterElement = document.createElement('div');
    gutterElement.style.width = dom.toPixel(42);
    gutterElement.classList.add('m-editor__gutter')

    this._el = gutterElement;

    dom.insertChildAtIndex(root, gutterElement, 0);
  }
}
