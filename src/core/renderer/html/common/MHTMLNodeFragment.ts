import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLGlyphParen, ParenDirection } from '@/core/renderer/html/common/MHTMLGlyphParen';
import { MHTMLGlyphTextNode } from '@/core/renderer/html/common/MHTMLGlyphTextNode';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';

export class MHTMLNodeFragment extends MHTMLGlyphDOM<DocumentFragment> {
  private readonly _hasLeftParen: boolean;
  private readonly _hasRightParen: boolean;

  constructor(private _children: MHTMLGlyphDOM[]) {
    super();

    this._el = document.createDocumentFragment();

    for (const glyph of this._children) {
      this._el.appendChild(glyph.el);

      if (glyph instanceof MHTMLGlyphParen) {
        if (glyph.type === ParenDirection.Left) {
          this._hasLeftParen = true;
        }

        if (glyph.type === ParenDirection.Right) {
          this._hasRightParen = true;
        }
      }
    }
  }

  public at(column: number): MHTMLGlyphWord | undefined {
    const glyphs = this._children.filter((glyph) => glyph instanceof MHTMLGlyphWord) as MHTMLGlyphWord[];

    return glyphs.find((glyph) => glyph.startColumn <= column && glyph.endColumn > column);
  }

  public get hasLeftParen(): boolean {
    return this._hasLeftParen;
  }

  public get hasRightParen(): boolean {
    return this._hasRightParen;
  }

  public get children(): MHTMLGlyphDOM[] {
    return this._children;
  }

  public dispose(): void {
    super.dispose();
    this._children = [];
  }
}
