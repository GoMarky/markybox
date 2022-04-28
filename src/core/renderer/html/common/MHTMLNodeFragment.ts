import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLGlyphParen, ParenType } from '@/core/renderer/html/common/MHTMLGlyphParen';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';

export class MHTMLNodeFragment extends MHTMLGlyphDOM<DocumentFragment> {
  private readonly _hasOpenBrace: boolean;
  private readonly _hasCloseBrace: boolean;

  constructor(private _children: MHTMLGlyphDOM[]) {
    super();

    this._el = document.createDocumentFragment();

    for (const glyph of this._children) {
      this._el.appendChild(glyph.el);

      if (glyph instanceof MHTMLGlyphParen) {
        if (glyph.type === ParenType.OpenBrace) {
          this._hasOpenBrace = true;
        }

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
