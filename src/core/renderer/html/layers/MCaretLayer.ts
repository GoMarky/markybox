import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MHTMLRenderer } from '@/core';
import { IPosition } from '@/core/renderer/common';
import { toPixel } from '@/base/dom';

export class MCaretLayer extends MLayer {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  public setPosition(position: IPosition): void {
    const { left, top } = this.renderer.toDOMPosition(position);

    this._el.style.left = toPixel(left);
    this._el.style.top = toPixel(top);
  }

  private init(): void {
    const { renderer } = this;

    const bodyElement = document.createElement('div');
    bodyElement.classList.add('m-editor__layer-caret')
    this._el = bodyElement;
    renderer.body.el.appendChild(bodyElement);
  }
}
