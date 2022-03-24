import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { isLeftParen } from '@/base/string';

export enum ParenDirection {
  Left = 'left',
  Right = 'right',
}

export class MHTMLGlyphParen extends MHTMLGlyphDOM<HTMLSpanElement> {
  public readonly type: ParenDirection;

  constructor(public text: string) {
    super();

    const element = document.createElement('span');

    this.type = isLeftParen(text) ? ParenDirection.Left : ParenDirection.Right;

    this._el = element;
    this._el.classList.add(`m-editor__paren-${this.type}`)
    this._el.textContent = this.text;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();

    this.text = '';
    this._el.remove();
  }
}
