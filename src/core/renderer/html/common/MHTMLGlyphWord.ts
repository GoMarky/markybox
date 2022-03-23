import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLGlyphWord extends MHTMLGlyphDOM<HTMLSpanElement> {
  constructor(private _text: string) {
    super();

    const element = document.createElement('span');

    this._el = element;
    this._el.textContent = this._text;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();

    this._text = '';
    this._el.remove();
  }
}
