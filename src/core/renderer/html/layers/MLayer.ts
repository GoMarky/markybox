import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { toPixel } from '@/base/dom';

export abstract class MLayer extends MHTMLGlyphDOM<HTMLDivElement> {
  protected zIndex = 0;

  public top(px: number) {
    this._el.style.top = toPixel(px);
  }
}
