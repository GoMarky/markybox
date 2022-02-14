import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MHTMLRenderer } from '@/core';

export class MTextLayer extends MLayer {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  private init(): void {
    const { renderer } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__layer-text')
    this._el = bodyElement;
    renderer.body.el.appendChild(bodyElement);
  }
}
