import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';

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

  public get text(): string {
    return this._children.join('');
  }

  public input(char: MChar): void {
    this._text += char;

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
