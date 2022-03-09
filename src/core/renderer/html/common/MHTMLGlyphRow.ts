import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';

export class MHTMLGlyphRow extends MDomObject {
  private _children: MHTMLGlyphWord[] = [];

  constructor(
    public readonly layer: HTMLElement,
    public readonly index: number
  ) {
    super();

    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row')

    this._el = rowElement;
    layer.appendChild(this._el);
  }

  public get children(): MHTMLGlyphWord[] {
    return this._children;
  }

  public insert(glyph: MHTMLGlyphWord): void {
    this._children.push(glyph);
    this._el.appendChild(glyph.el);

    this.draw();
  }

  public remove(glyph: MHTMLGlyphWord): void {
    this._children = this._children.filter((child) => child !== glyph);

    this.draw();
  }

  public getGlyphByColumn(column: number): MHTMLGlyphWord | undefined {
    return this._children.find((glyph) => glyph.startColumn <= column && glyph.endColumn >= column);
  }

  public draw(): void {
    for (const glyph of this._children) {
      glyph.draw();
    }
  }
}
