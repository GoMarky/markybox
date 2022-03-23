import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLGlyphWord extends MHTMLGlyphDOM<HTMLSpanElement> {
  constructor(public text: string) {
    super();

    const element = document.createElement('span');

    this._el = element;
    this._el.textContent = this.text;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();

    this.text = '';
    this._el.remove();
  }
}
