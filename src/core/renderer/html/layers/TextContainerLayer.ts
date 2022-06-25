import { BaseLayer } from '@/core/renderer/html/layers/BaseLayer';
import { HTMLRenderer } from '@/core';
import { EditorCSSName } from '@/core/renderer/html/common/helpers';

export class TextContainerLayer extends BaseLayer {
  constructor() {
    super();
  }

  public mount(body: HTMLElement): void {
    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add(EditorCSSName.Layer);
    bodyElement.classList.add(EditorCSSName.LayerText)
    this._el = bodyElement;
    body.appendChild(bodyElement);
  }
}
