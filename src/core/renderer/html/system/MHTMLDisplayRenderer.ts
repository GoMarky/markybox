import { MObject } from '@/core/objects/MObject';
import { IRendererDisplay } from '@/core/renderer/renderer';
import { toPixel } from '@/base/dom';
import { MHTMLRenderer } from '@/core';

export class HTMLDisplayRenderer extends MObject implements IRendererDisplay {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  public setFullScreen(): void {
    const { innerWidth, innerHeight } = window;
    const { root } = this.renderer;

    root.style.width = toPixel(innerWidth);
    root.style.height = toPixel(innerHeight);
  }
}
