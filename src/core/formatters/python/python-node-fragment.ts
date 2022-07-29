import { GlyphNodeFragment } from '@/core/renderer/common/GlyphNodeFragment';
import { GlyphDOMNode } from '@/core/renderer/glyphs/GlyphDOMNode';
import { GlyphParenNode, ParenType } from '@/core/renderer/glyphs/GlyphParenNode';

export class MHTMLPythonNodeFragment extends GlyphNodeFragment {
  constructor() {
    super();
  }

  public setChildren(children: GlyphDOMNode[]) {
    this._el = document.createDocumentFragment();

    this._children = children;
  }
}
