import { GlyphWordNode } from '@/core/renderer/html/common/GlyphWordNode';
import { MChar } from '@/core/renderer/html/editor/EditorBodyTextarea';
import * as string from '@/base/string';
import * as dom from '@/base/dom';
import { GlyphTextNode } from '@/core/renderer/html/common/GlyphTextNode';
import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';
import { HTMLRenderer } from '@/core';
import { splitAtIndex } from '@/core/app/common';
import { IVisitor } from '@/core/renderer/html/editor/EditorBodyContainer';
import { GlyphNodeFragment } from '@/core/renderer/html/common/GlyphNodeFragment';
import { GlyphParenNode, ParenType } from '@/core/renderer/html/common/GlyphParenNode';
import { CriticalError } from '@/base/errors';
import { GlyphRowGutterElement } from '@/core/renderer/html/common/GlyphRowGutterElement';
import { getLastElement } from '@/base/array';

export interface IInputParseResult {
  startColumn?: number;
  endColumn?: number;
  type: 'whitespace' | 'text' | 'paren';
  data: string;
}

export class GlyphRowElement extends GlyphDOMNode<HTMLDivElement> {
  private _text: string = '';
  private _renderer: HTMLRenderer;
  private _gutter: GlyphRowGutterElement;

  public fragment: GlyphNodeFragment;
  public index: number;

  constructor() {
    super();
  }

  public get columnsCount(): number {
    return this._text.length;
  }

  public get text(): string {
    return this._text;
  }

  public setParent(renderer: HTMLRenderer, index: number): void {
    this._renderer = renderer;

    this.index = index;
    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row');
    this._gutter = new GlyphRowGutterElement(renderer, index);
    dom.insertChildAtIndex(this._renderer.display.gutter.el, this._gutter.el, index);

    this._el = rowElement;
  }

  public lastCharIs(char: ParenType): boolean {
    if (!this.fragment) {
      throw new CriticalError(`this.fragment must be defined`);
    }

    const last = getLastElement(this.fragment.children);

    return last instanceof GlyphParenNode && last.type === char;
  }

  public containsOnlyWhitespaces(): boolean {
    if (!this.fragment) {
      throw new CriticalError(`this.fragment must be defined`);
    }

    return this.fragment.children.every(child => child instanceof GlyphTextNode);
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

  protected parseWord(word: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const chars = word.split('');

    let tempString = '';

    while (chars.length) {
      const currentChar = chars.shift();

      if (!currentChar) {
        throw new CriticalError(`MHTMLGlyphRow.parseWord - expected currentChar to be defined.`);
      }

      if (string.isParen(currentChar) || string.isDot(currentChar)) {
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

  protected parseText(text: string): IInputParseResult[] {
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
          if (string.containsParen(word) || string.containsDot(word)) {
            result.push(...this.parseWord(word));
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

  private clearNodeFragment(): void {
    const { fragment } = this;

    // Очищаем старые
    if (!fragment) {
      return;
    }

    this._el.replaceChildren();
    fragment.dispose();
  }

  public renderGlyphs(children: GlyphDOMNode[]): void {
    this.clearNodeFragment();

    const text = children.reduce((acc, glyph) => {
      acc += glyph.text
      return acc;
    }, '');

    this._text = text;

    console.log(text);

    this.doRender(children);
  }

  private render(): void {
    const { _text } = this;
    const words = this.parseText(_text);

    this.clearNodeFragment();

    const children: GlyphDOMNode[] = [];

    for (const { data, type, startColumn, endColumn } of words) {
      switch (type) {
        case 'whitespace': {
          const textNode = new GlyphTextNode(data);
          children.push(textNode);
          break;
        }
        case 'text': {
          const wordNode = new GlyphWordNode(data, startColumn as number, endColumn as number);
          children.push(wordNode);
          break;
        }
        case 'paren':
          const parenNode = new GlyphParenNode(data);
          children.push(parenNode);
          break;
      }
    }

    return this.doRender(children);
  }

  private doRender(children: GlyphDOMNode[]): void {
    const { body } = this._renderer;
    const { visitors } = body;

    const nodeFragment = this._renderer.body.formatter.factory.createNodeFragment();
    nodeFragment.setChildren(children);
    this.fragment = nodeFragment;

    this.accept(visitors);
    this._gutter.expandable = nodeFragment.hasOpenBrace;
    this._el.appendChild(nodeFragment.el);
  }
}
