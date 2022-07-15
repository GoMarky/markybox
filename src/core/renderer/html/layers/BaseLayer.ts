import { toPixel } from '@/base/dom';
import { GlyphDOMElement } from '@/core/renderer/html/common/GlyphDOMElement';

export abstract class BaseLayer extends GlyphDOMElement<HTMLDivElement> {
  public top(px: number): void {
    this._el.style.top = toPixel(px);
  }

  public left(px: number): void {
    this._el.style.left = toPixel(px);
  }
}
