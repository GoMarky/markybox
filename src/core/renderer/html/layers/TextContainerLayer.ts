import { BaseLayer } from '@/core/renderer/html/layers/BaseLayer';
import { HTMLRenderer } from '@/core';

export class TextContainerLayer extends BaseLayer {
  constructor() {
    super();
  }

  public mount(body: HTMLElement): void {
    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__layer');
    bodyElement.classList.add('m-editor__layer-text')
    this._el = bodyElement;
    body.appendChild(bodyElement);
  }
}
