import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MHTMLRenderer } from '@/core';

export class MTextLayer extends MLayer {
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
