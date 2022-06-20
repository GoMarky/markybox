import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';
import { MChar } from '@/core/renderer/html/editor/EditorBodyTextarea';

export class GlyphSpecialCharNode extends GlyphDOMNode<HTMLSpanElement> {
  constructor(public readonly char: MChar) {
    super();

    this._el = document.createElement('span');
    this._el.textContent = this.char;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
