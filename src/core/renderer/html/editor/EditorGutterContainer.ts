import * as dom from '@/base/dom';
import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';
import { EditorCSSName } from '@/core/renderer/html/common/helpers';

export class EditorGutterContainer extends GlyphDOMNode<HTMLDivElement> {
  constructor() {
    super();
  }

  public mount(root: HTMLElement): void {
    const gutterElement = document.createElement('div');
    gutterElement.style.width = dom.toPixel(42);
    gutterElement.classList.add(EditorCSSName.GutterContainer)

    this._el = gutterElement;

    dom.insertChildAtIndex(root, gutterElement, 0);
  }
}
