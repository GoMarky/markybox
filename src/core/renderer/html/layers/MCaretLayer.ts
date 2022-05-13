import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MHTMLRenderer } from '@/core';
import { IPosition } from '@/core/app/common';
import { toPixel } from '@/base/dom';

const colors: string[] = [
  'rgba(255,87,51,0.4)',
  'rgba(51,189,255,0.4)',
  'rgba(51,81,255,0.4)',
  'rgba(219,51,255,0.4)',
  'rgba(59,220,21,0.4)',
  'rgba(217,158,8,0.4)'
]

const getRandomColor = (): string => {
  return colors.shift() as string;
}

export class MCaretLayer extends MLayer {
  constructor(private readonly renderer: MHTMLRenderer, private readonly label: string) {
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
    caretElement.classList.add('m-editor__layer');
    caretElement.classList.add('m-editor__layer-caret')

    this._el.appendChild(caretElement);
  }

  private createUserLabelElement(): void {
    const { renderer, label } = this;

    const labelElement = document.createElement('div');
    labelElement.classList.add('m-editor__layer-caret-label')
    labelElement.textContent = label;
    labelElement.style.background = getRandomColor()
    renderer.body.el.appendChild(labelElement);

    this._el.appendChild(labelElement);
  }
}
