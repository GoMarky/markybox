import { GlyphDOMNode } from '@/core/renderer/html/glyphs/GlyphDOMNode';
import { toPixel } from '@/base/dom';
import { GlyphDOMElement } from '@/core/renderer/html/common/GlyphDOMElement';

export abstract class BaseLayer extends GlyphDOMElement<HTMLDivElement> {
  protected zIndex = 0;

  public top(px: number) {
    this._el.style.top = toPixel(px);
  }
}
