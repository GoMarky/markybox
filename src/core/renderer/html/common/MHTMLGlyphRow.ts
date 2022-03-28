import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import * as string from '@/base/string';
import { MHTMLGlyphTextNode } from '@/core/renderer/html/common/MHTMLGlyphTextNode';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLRenderer } from '@/core';
import { splitAtIndex } from '@/core/app/common';
import { IVisitor } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { containsParen, isParen } from '@/base/string';
import { MHTMLGlyphParen } from '@/core/renderer/html/common/MHTMLGlyphParen';
import { CriticalError } from '@/base/errors';
import { MHTMLGlyphRowGutter } from '@/core/renderer/html/common/MHTMLGlyphRowGutter';

interface IInputParseResult {
  type: 'whitespace' | 'text' | 'paren';
  data: string;
}

export class MHTMLGlyphRow extends MHTMLGlyphDOM<HTMLDivElement> {
  private fragment: MHTMLNodeFragment;
  private _text: string = '';

  private readonly gutterElement: MHTMLGlyphRowGutter;

  constructor(
    private readonly renderer: MHTMLRenderer,
    public index: number
  ) {
    super();

    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row');

    this.gutterElement = new MHTMLGlyphRowGutter(index);

    this.renderer.gutter.el.appendChild(this.gutterElement.el);

    this._el = rowElement;
  }

  public get columnsCount(): number {
    return this._text.length;
  }

  public get text(): string {
    return this._text;
  }

  public empty(): boolean {
    return this._text.length === 0;
  }

  public setIndex(index: number): void {
    this.index = index;
    this.gutterElement.index = index;
  }

  public setText(text: string): void {
    this._text = text;

    this.render();
  }

  public contains(column: number): boolean {
    return (this.columnsCount - 1) >= column;
  }

  public clearLetterByPosition(index: number): void {
    const { _text } = this;
    const [first, last] = splitAtIndex(index)(_text);
    this._text = first + string.removeFirstLetter(last);

    this.render();
  }

  public inputAt(char: MChar, index: number): void {
    const [first, last] = splitAtIndex(index)(this._text);
    this._text = first + char + last;

    this.render();
  }

  public accept(visitors: IVisitor[]): void {
    const { fragment } = this;

    visitors.forEach((visitor) => visitor.visit(fragment));
  }

  private static parseWord(word: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const chars = word.split('');

    let tempString = '';

    while (chars.length) {
      const currentChar = chars.shift();

      if (!currentChar) {
        throw new CriticalError(`MHTMLGlyphRow.parseWord - expected currentChar to be defined.`);
      }

      if (isParen(currentChar)) {
        if (tempString.length) {
          result.push({
            type: 'text',
            data: tempString,
          })
          tempString = '';
        }

        result.push({ type: 'paren', data: currentChar })
      } else {
        tempString += currentChar;
      }
    }

    return result;
  }

  private static parseText(text: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const words = text.split(/(\s+)/);

    for (const word of words) {
      const isWhitespace = word.trim().length === 0;

      let type: IInputParseResult['type'];

      switch (true) {
        case isWhitespace:
          type = 'whitespace';
          break;
        case isParen(word):
          type = 'paren'
          break;
        default: {
          if (containsParen(word)) {
            result.push(...MHTMLGlyphRow.parseWord(word));
            continue;
          }

          type = 'text';
          break;
        }
      }

      result.push({
        type,
        data: word,
      });
    }

    return result;
  }

  private render(): void {
    const { _text, fragment, renderer } = this;
    const { body } = renderer;
    const { visitors } = body;
    const words = MHTMLGlyphRow.parseText(_text);

    // Очищаем старые
    if (fragment) {
      this._el.replaceChildren();
      fragment.dispose();
    }

    const children: MHTMLGlyphDOM[] = [];

    for (const { data, type } of words) {
      switch (type) {
        case 'whitespace': {
          const textNode = new MHTMLGlyphTextNode(data);
          children.push(textNode);
          break;
        }
        case 'text': {
          const wordNode = new MHTMLGlyphWord(data);
          children.push(wordNode);
          break;
        }
        case 'paren':
          const parenNode = new MHTMLGlyphParen(data);
          children.push(parenNode);
          break;
      }
    }

    const nodeFragment = new MHTMLNodeFragment(children);
    this.fragment = nodeFragment;

    this.accept(visitors);

    this.gutterElement.expandable = nodeFragment.hasLeftParen;

    this._el.appendChild(nodeFragment.el);
  }

  public dispose(): void {
    super.dispose();

    this.gutterElement.dispose();
    this.fragment.dispose();
  }
}
