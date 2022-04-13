import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MHTMLGlyphWord extends MHTMLGlyphDOM<HTMLSpanElement> {
  constructor(public readonly text: string, public readonly startColumn: number, public readonly endColumn: number) {
    super();

    this._el = document.createElement('span');
    this._el.textContent = this.text;
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
