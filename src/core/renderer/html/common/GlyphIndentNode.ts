import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';

export class GlyphIndentNode extends GlyphDOMNode<HTMLSpanElement> {
  constructor(private readonly rawText: string) {
    super();

    this._el = document.createElement('span');
    this._el.textContent = this.rawText;
    this._el.classList.add('marky__indent-node');
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
