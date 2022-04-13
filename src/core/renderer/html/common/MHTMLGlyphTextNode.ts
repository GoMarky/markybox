import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLGlyphTextNode extends MHTMLGlyphDOM<Text> {
  constructor(public readonly text: string) {
    super();

    this._el = document.createTextNode(text);
    this._el.textContent = this.text;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
