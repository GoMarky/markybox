import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import * as string from '@/base/string';
import * as dom from '@/base/dom';
import { MHTMLGlyphTextNode } from '@/core/renderer/html/common/MHTMLGlyphTextNode';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLRenderer } from '@/core';
import { splitAtIndex } from '@/core/app/common';
import { IVisitor } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { MHTMLGlyphParen, ParenType } from '@/core/renderer/html/common/MHTMLGlyphParen';
import { CriticalError } from '@/base/errors';
import { MHTMLGlyphRowGutter } from '@/core/renderer/html/common/MHTMLGlyphRowGutter';
import { getLastElement } from '@/base/array';

interface IInputParseResult {
  startColumn?: number;
  endColumn?: number;
  type: 'whitespace' | 'text' | 'paren';
  data: string;
}

export class MHTMLGlyphRow extends MHTMLGlyphDOM<HTMLDivElement> {
  private _text: string = '';
  private _renderer: MHTMLRenderer;
  private _gutter: MHTMLGlyphRowGutter;

  public fragment: MHTMLNodeFragment | undefined;
  public index: number;

  constructor() {
    super();
  }

  public setParent(renderer: MHTMLRenderer, index: number): void {
    this._renderer = renderer;

    this.index = index;
    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row');
    this._gutter = new MHTMLGlyphRowGutter(renderer, index);
    dom.insertChildAtIndex(this._renderer.display.gutter.el, this._gutter.el, index);

    this._el = rowElement;
  }

  public lastCharIs(char: ParenType): boolean {
    if (!this.fragment) {
      throw new CriticalError(`this.fragment must be defined`);
    }

    const last = getLastElement(this.fragment.children);

    return last instanceof MHTMLGlyphParen && last.type === char;
  }

  public containsOnlyWhitespaces(): boolean {
    if (!this.fragment) {
      throw new CriticalError(`this.fragment must be defined`);
    }

    return this.fragment.children.every(child => child instanceof MHTMLGlyphTextNode);
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
    this._gutter.index = index;
  }

  public contains(column: number): boolean {
    return (this.columnsCount - 1) >= column;
  }

  public clearLetterByPosition(column: number): void {
    const index = column - 1;

    const { _text } = this;
    const [first, last] = splitAtIndex(index)(_text);
    this._text = first + string.removeFirstLetter(last);

    this.render();
  }

  public erase(): void {
    return this.setText('');
  }

  public slice(start: number, _: number): void {
    if (this.containsOnlyWhitespaces()) {
      const slicedText = this._text.slice(0, start);

      this._text = slicedText;
      this.render();
    }

    // TODO:
    // Write logic for non-empty rows.
  }

  public append(text: string): void {
    this._text = this._text + text;
    this.render();
  }

  public setText(text: string): void {
    this._text = text;

    this.render();
  }

  public inputAt(char: MChar, index: number): void {
    const [first, last] = splitAtIndex(index)(this._text);
    this._text = first + char + last;

    this.render();
  }

  public accept(visitors: IVisitor[]): void {
    if (!this.fragment) {
      throw new CriticalError(`this.fragment must be defined`);
    }

    const { fragment } = this;

    visitors.forEach((visitor) => visitor.visit(fragment));
  }

  public dispose(): void {
    this._gutter.dispose();
    this.fragment?.dispose();
    this._el.remove();
  }

  public toString(): string {
    return this._text;
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

      // TODO: make string.isColon only for python
      if (string.isParen(currentChar) || string.isDot(currentChar) /* || string.isColon(currentChar) */) {
        if (tempString.length) {
          result.push({ type: 'text', data: tempString });
          tempString = '';
        }

        result.push({ type: 'paren', data: currentChar })
      } else {
        tempString += currentChar;
      }
    }

    if (tempString.length) {
      result.push({
        type: 'text',
        data: tempString,
      })
    }

    return result;
  }

  private static parseText(text: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const words = text.split(/(\s+)/);

    let currentPosition = 0;

    for (const word of words) {
      const isWhitespace = word.trim().length === 0;

      const startColumn = currentPosition;
      currentPosition += word.length;
      const endColumn = currentPosition;

      let type: IInputParseResult['type'];

      switch (true) {
        case isWhitespace:
          type = 'whitespace';
          break;
        case string.isParen(word):
          type = 'paren'
          break;
        default: {
          // TODO: Make word.includes('.) only for python
          if (string.containsParen(word) || string.containsDot(word) /* || word.includes(':') */) {
            result.push(...MHTMLGlyphRow.parseWord(word));
            continue;
          }

          type = 'text';
          break;
        }
      }

      result.push({
        startColumn,
        endColumn,
        type,
        data: word,
      });
    }

    return result;
  }

  private render(): void {
    const { _text, fragment, _renderer } = this;
    const { body } = _renderer;
    const { visitors } = body;
    const words = MHTMLGlyphRow.parseText(_text);

    // Очищаем старые
    if (fragment) {
      this._el.replaceChildren();
      fragment?.dispose();
    }

    const children: MHTMLGlyphDOM[] = [];

    for (const { data, type, startColumn, endColumn } of words) {
      switch (type) {
        case 'whitespace': {
          const textNode = new MHTMLGlyphTextNode(data);
          children.push(textNode);
          break;
        }
        case 'text': {
          const wordNode = new MHTMLGlyphWord(data, startColumn as number, endColumn as number);
          children.push(wordNode);
          break;
        }
        case 'paren':
          const parenNode = new MHTMLGlyphParen(data);
          children.push(parenNode);
          break;
      }
    }

    const nodeFragment = new MHTMLNodeFragment();
    nodeFragment.setChildren(children);
    this.fragment = nodeFragment;

    this.accept(visitors);
    this._gutter.expandable = nodeFragment.hasOpenBrace;
    this._el.appendChild(nodeFragment.el);
  }
}
