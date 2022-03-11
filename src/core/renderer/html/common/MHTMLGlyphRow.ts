import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import { splitAtIndex } from '@/core/renderer/common';
import { removeFirstLetter } from '@/base/string';

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

  public clearLetterByPosition(index: number): void {
    const { _text } = this;
    const [first, last] = splitAtIndex(index)(_text);
    this._text = first + removeFirstLetter(last);

    this.render();
  }

  public inputAt(char: MChar, index: number): void {
    const [first, last] = splitAtIndex(index)(this._text);
    this._text = first + char + last;

    this.render();
  }

  private render(): void {
    const { _el, _text, _children } = this;
    const words = JavascriptCodeFormatter.parseKeywords(_text);

    // Очищаем старые
    _children.forEach((glyph) => glyph.dispose());

    for (const { data, className } of words) {
      const glyph = new MHTMLGlyphWord(_el, data, className);
      this._children.push(glyph);
    }
  }
}
