import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLGlyphParen, ParenType } from '@/core/renderer/html/common/MHTMLGlyphParen';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';

export class MHTMLNodeFragment extends MHTMLGlyphDOM<DocumentFragment> {
  private readonly _hasOpenBracket: boolean;
  private readonly _hasCloseBracket: boolean;

  constructor(private _children: MHTMLGlyphDOM[]) {
    super();

    this._el = document.createDocumentFragment();

    for (const glyph of this._children) {
      this._el.appendChild(glyph.el);

      if (glyph instanceof MHTMLGlyphParen) {
        if (glyph.type === ParenType.OpenBracket) {
          this._hasOpenBracket = true;
        }

        if (glyph.type === ParenType.CloseBracket) {
          this._hasCloseBracket = true;
        }
      }
    }
  }

  public at(column: number): MHTMLGlyphWord | undefined {
    const glyphs = this._children.filter((glyph) => glyph instanceof MHTMLGlyphWord) as MHTMLGlyphWord[];

    return glyphs.find((glyph) => glyph.startColumn <= column && glyph.endColumn > column);
  }

  public get hasOpenBracket(): boolean {
    return this._hasOpenBracket;
  }

  public get hasCloseBracket(): boolean {
    return this._hasCloseBracket;
  }

  public get children(): MHTMLGlyphDOM[] {
    return this._children;
  }

  public dispose(): void {
    super.dispose();
    this._children = [];
  }
}
