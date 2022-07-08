import { GlyphDOMNode } from '@/core/renderer/html/glyphs/GlyphDOMNode';
import { GlyphParenNode, ParenType } from '@/core/renderer/html/glyphs/GlyphParenNode';
import { GlyphDOMElement } from '@/core/renderer/html/common/GlyphDOMElement';

function removeClasses(glyph: GlyphDOMNode): void {
  const { el } = glyph;

  if (el instanceof HTMLElement) {
    el.removeAttribute('class');
  }
}

export class GlyphNodeFragment extends GlyphDOMElement<DocumentFragment> {
  protected _hasOpenBrace: boolean = false;
  protected _hasCloseBrace: boolean = false;
  protected _children: GlyphDOMNode[] = [];
  public parenDepthLevel: number = 0;

  constructor() {
    super();
  }

  public setParentDepthLevel(level: number): void {
    this.parenDepthLevel = level;
  }

  public clearSyntaxClasses(): void {
    for (const glyph of this._children) {
      removeClasses(glyph);
    }
  }

  public setChildren(children: GlyphDOMNode[]): void {
    this._el = document.createDocumentFragment();

    this._children = children;

    for (const glyph of children) {
      this._el.appendChild(glyph.el);

      if (glyph instanceof GlyphParenNode) {
        if (glyph.type === ParenType.OpenBrace) {
          this._hasOpenBrace = true;
        }

        if (glyph.type === ParenType.CloseBrace) {
          this._hasCloseBrace = true;
        }
      }
    }
  }

  public at(column: number): GlyphDOMNode | undefined {
    const glyphs = this._children;

    return glyphs.find((glyph) => glyph.start <= column && glyph.end >= column);
  }

  public get hasOpenBrace(): boolean {
    return this._hasOpenBrace;
  }

  public get hasCloseBrace(): boolean {
    return this._hasCloseBrace;
  }

  public get children(): GlyphDOMNode[] {
    return this._children;
  }

  public dispose(): void {
    super.dispose();
    this._children = [];
  }
}
