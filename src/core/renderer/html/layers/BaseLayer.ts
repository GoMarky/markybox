import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';
import { toPixel } from '@/base/dom';

export abstract class BaseLayer extends GlyphDOMNode<HTMLDivElement> {
  protected zIndex = 0;

  public top(px: number) {
    this._el.style.top = toPixel(px);
  }
}
