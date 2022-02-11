import { MObject } from '@/core/objects/MObject';
import { toPixel } from '@/base/dom';

export class MRow extends MObject {
  constructor(
    public readonly index: number
  ) {
    super();
  }

  public get element(): HTMLElement {
    const { index } = this;

    const element = document.createElement('span');
    element.textContent = `${index}`;
    element.classList.add('m-gutter__cell');
    element.style.height = toPixel(19);

    return element;
  }
}
