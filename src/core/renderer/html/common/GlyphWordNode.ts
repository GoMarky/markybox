import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';

export class GlyphWordNode extends GlyphDOMNode<HTMLSpanElement> {
  constructor(private readonly rawText: string, public readonly startColumn: number, public readonly endColumn: number) {
    super();

    this._el = document.createElement('span');
    this._el.textContent = this.rawText;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }

  public get length(): number {
    return this.text.length;
  }
}
