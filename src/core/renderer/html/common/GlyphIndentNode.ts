import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';

export class GlyphIndentNode extends GlyphDOMNode<HTMLSpanElement> {
  constructor(public readonly text: string) {
    super();

    this._el = document.createElement('span');
    this._el.textContent = this.text;
    this._el.classList.add('marky__indent-node');
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
