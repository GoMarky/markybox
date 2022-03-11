import { MGlyph } from '@/core/objects/MGlyph';
import { KeywordClassName } from '@/core/formatters/common';

export class MHTMLGlyphWord extends MGlyph {
  private readonly _el: HTMLSpanElement;

  constructor(parent: HTMLElement, private _text: string, className: KeywordClassName = 'm-editor__plain') {
    super();

    const element = document.createElement('span');
    element.classList.add(className);

    this._el = element;
    this._el.textContent = this._text;
    parent.appendChild(this._el);
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();

    this._text = '';
    this._el.remove();
  }
}
