import { GlyphNodeFragment } from '@/core/renderer/html/common/GlyphNodeFragment';
import { GlyphDOMNode } from '@/core/renderer/html/glyphs/GlyphDOMNode';
import { GlyphParenNode, ParenType } from '@/core/renderer/html/glyphs/GlyphParenNode';

export class MHTMLPythonNodeFragment extends GlyphNodeFragment {
  constructor() {
    super();
  }

  public setChildren(children: GlyphDOMNode[]) {
    this._el = document.createDocumentFragment();

    this._children = children;

    for (const glyph of children) {
      this._el.appendChild(glyph.el);

      if (glyph instanceof GlyphParenNode && glyph.type === ParenType.Colon) {
        this._hasOpenBrace = true;
      }
    }
  }
}
