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
    const { display } = this.renderer;
    const { left, top } = display.toDOMPosition(position);

    this._el.style.left = toPixel(left);
    this._el.style.top = toPixel(top);
  }

  private init(): void {
    const { renderer } = this;

    const bodyElement = document.createElement('div');
    bodyElement.classList.add('m-editor__layer-caret-container')
    this._el = bodyElement;
    renderer.body.el.appendChild(bodyElement);

    this.createCaretElement();
    this.createUserLabelElement();
  }

  private createCaretElement(): void {
    const caretElement = document.createElement('div');
    caretElement.classList.add('m-editor__layer-caret')

    this._el.appendChild(caretElement);
  }

  private createUserLabelElement(): void {
    const { renderer } = this;

    const labelElement = document.createElement('div');
    labelElement.classList.add('m-editor__layer-caret-label')
    labelElement.textContent = 'Andrew';
    renderer.body.el.appendChild(labelElement);

    this._el.appendChild(labelElement);
  }
}
