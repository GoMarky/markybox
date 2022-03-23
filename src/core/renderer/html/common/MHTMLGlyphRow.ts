import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import * as string from '@/base/string';
import { MHTMLGlyphTextNode } from '@/core/renderer/html/common/MHTMLGlyphTextNode';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLRenderer } from '@/core';
import { splitAtIndex } from '@/core/app/common';

interface IInputParseResult {
  type: 'whitespace' | 'text';
  data: string;
}

export class MHTMLNodeFragment extends MHTMLGlyphDOM<DocumentFragment> {
  constructor(private _children: MHTMLGlyphDOM[]) {
    super();

    this._el = document.createDocumentFragment();

    for (const glyph of this._children) {
      this._el.appendChild(glyph.el);
    }
  }

  public get children(): MHTMLGlyphDOM[] {
    return this._children;
  }

  public dispose(): void {
    super.dispose();
    this._children = [];
  }
}

export class MHTMLGlyphRow extends MHTMLGlyphDOM<HTMLDivElement> {
  private fragment: MHTMLNodeFragment;
  private _text: string = '';

  constructor(
    private readonly renderer: MHTMLRenderer,
    public readonly index: number
  ) {
    super();

    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row')

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

  private static parse(text: string): IInputParseResult[] {
    const result: IInputParseResult[] = [];
    const words = text.split(/(\s+)/)

    for (const word of words) {
      const isWhitespace = word.trim().length === 0;

      const type: IInputParseResult['type'] = isWhitespace ? 'whitespace' : 'text';

      result.push({
        type,
        data: word,
      });
    }

    return result;
  }

  private setFragment(fragment: MHTMLNodeFragment): void {
    this.fragment = fragment;
    this._el.appendChild(fragment.el);
  }

  private render(): void {
    const { _text, fragment } = this;
    const words = MHTMLGlyphRow.parse(_text);

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
      }
    }

    const nodeFragment = new MHTMLNodeFragment(children);

    this.setFragment(nodeFragment);
  }
}
