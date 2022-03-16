import { MGlyph } from '@/core/objects/MGlyph';

export class MHTMLGlyphTextNode extends MGlyph {
  private readonly _el: Text;

  constructor(parent: HTMLElement, private _text: string) {
    super();

    const element = document.createTextNode(_text);

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
