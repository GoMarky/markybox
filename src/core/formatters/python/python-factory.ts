import { BaseFormatterFactory, IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLGlyphParen, ParenType } from '@/core/renderer/html/common/MHTMLGlyphParen';

class MHTMLPythonNodeFragment extends MHTMLNodeFragment {
  constructor() {
    super();
  }

  public setChildren(children: MHTMLGlyphDOM[]) {
    this._el = document.createDocumentFragment();

    this._children = children;

    for (const glyph of children) {
      this._el.appendChild(glyph.el);

      if (glyph instanceof MHTMLGlyphParen && glyph.type === ParenType.Colon) {
        this._hasOpenBrace = true;
      }
    }
  }
}

export class PythonFactory extends BaseFormatterFactory implements IAbstractFormatterFactory {
  constructor() {
    super();
  }

  public createNodeFragment(): MHTMLNodeFragment {
    return new MHTMLPythonNodeFragment()
  }
}
