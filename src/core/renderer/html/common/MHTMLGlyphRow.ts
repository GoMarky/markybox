import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import * as array from '@/core/renderer/common';
import * as string from '@/base/string';
import { MHTMLGlyphParen } from '@/core/renderer/html/common/MHTMLGlyphParen';

export class MHTMLGlyphRow extends MDomObject {
  private _children: MHTMLGlyphWord[] = [];

  private _text: string = '';

  constructor(
    public readonly index: number
  ) {
    super();

    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row')

    this._el = rowElement;
  }

  public get columns(): number {
    return this._text.length;
  }

  public get text(): string {
    return this._text;
  }

  public empty(): boolean {
    return this._children.length === 0;
  }

  public setText(text: string): void {
    this._text = text;

    this.render();
  }

  public contains(column: number): boolean {
    return column <= this.columns - 1;
  }

  public clearLetterByPosition(index: number): void {
    const { _text } = this;
    const [first, last] = array.splitAtIndex(index)(_text);
    this._text = first + string.removeFirstLetter(last);

    this.render();
  }

  public inputAt(char: MChar, index: number): void {
    const [first, last] = array.splitAtIndex(index)(this._text);
    this._text = first + char + last;

    this.render();
  }

  private render(): void {
    const { _el, _text, _children } = this;
    const words = JavascriptCodeFormatter.parseKeywords(_text);

    // Очищаем старые
    _children.forEach((glyph) => glyph.dispose());

    for (const { data, className } of words) {
      const isLeftParen = string.isLeftParen(data.trim());

      if (isLeftParen) {
        const lParenGlyph = new MHTMLGlyphParen(_el, '{');
        const rParenGlyph = new MHTMLGlyphParen(_el, '}');

        this._children.push(lParenGlyph);
        this._children.push(rParenGlyph);
      } else {
        const glyph = new MHTMLGlyphWord(_el, data, className);
        this._children.push(glyph);
      }
    }
  }
}
