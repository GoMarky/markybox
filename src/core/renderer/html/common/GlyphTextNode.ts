import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';

export class GlyphTextNode extends GlyphDOMNode<Text> {
  constructor(private readonly rawText: string) {
    super();

    this._el = document.createTextNode(rawText);
    this._el.textContent = this.rawText;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
