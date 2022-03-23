import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLGlyphTextNode extends MHTMLGlyphDOM<Text> {
  constructor(private _text: string) {
    super();


    const element: Text = document.createTextNode(_text);

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
