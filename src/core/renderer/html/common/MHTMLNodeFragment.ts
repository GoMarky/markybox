import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLNodeFragment extends MHTMLGlyphDOM<DocumentFragment> {
  constructor(private _children: MHTMLGlyphDOM[]) {
    super();

    this._el = document.createDocumentFragment();

    for (const glyph of this._children) {
      this._el.appendChild(glyph.el);
    }
  }

  public get children(): MHTMLGlyphDOM[] {
    return this._children;
  }

  public dispose(): void {
    super.dispose();
    this._children = [];
  }
}
