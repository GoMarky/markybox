import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLGlyphParen, ParenType } from '@/core/renderer/html/common/MHTMLGlyphParen';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';

export class MHTMLNodeFragment extends MHTMLGlyphDOM<DocumentFragment> {
  private _hasOpenBrace: boolean;
  private _hasCloseBrace: boolean;
  private _children: MHTMLGlyphDOM[];

  constructor() {
    super();

  }

  public setChildren(children: MHTMLGlyphDOM[]): void {
    this._el = document.createDocumentFragment();

    this._children = children;

    for (const glyph of children) {
      this._el.appendChild(glyph.el);

      if (glyph instanceof MHTMLGlyphParen) {
        if (glyph.type === ParenType.OpenBrace) {
          this._hasOpenBrace = true;
        }

        // TODO: MAKE ONLY FOR PYTHON
        // if (glyph.type === ParenType.Colon) {
        //   this._hasOpenBrace = true;
        // }

        if (glyph.type === ParenType.CloseBrace) {
          this._hasCloseBrace = true;
        }
      }
    }
  }

  public at(column: number): MHTMLGlyphWord | undefined {
    const glyphs = this._children.filter((glyph) => glyph instanceof MHTMLGlyphWord) as MHTMLGlyphWord[];

    return glyphs.find((glyph) => glyph.startColumn <= column && glyph.endColumn > column);
  }

  public get hasOpenBrace(): boolean {
    return this._hasOpenBrace;
  }

  public get hasCloseBrace(): boolean {
    return this._hasCloseBrace;
  }

  public get children(): MHTMLGlyphDOM[] {
    return this._children;
  }

  public dispose(): void {
    super.dispose();
    this._children = [];
  }
}
