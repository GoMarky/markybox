import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';
import { MChar } from '@/core/renderer/html/editor/EditorBodyTextarea';
import { EditorCSSName } from '@/core/renderer/html/common/helpers';

export class GlyphSpecialCharNode extends GlyphDOMNode<HTMLSpanElement> {
  constructor(private readonly char: MChar, start: number, end: number) {
    super(start, end);

    this._el = document.createElement('span');
    this._el.textContent = this.char;
    this._el.classList.add(EditorCSSName.NodeSpecialChar);
  }

  public is(char: MChar): boolean {
    return this.char === char;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
