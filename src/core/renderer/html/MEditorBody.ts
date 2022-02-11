import { MObject } from '@/core/objects/MObject';
import { toPixel } from '@/base/dom';

export class MEditorBody extends MObject {
  private bodyEl: HTMLDivElement;

  constructor(private readonly root: HTMLElement) {
    super();
  }

  public init(): void {
    const { root } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = 'auto';
    bodyElement.style.height = toPixel(root.offsetHeight);
    bodyElement.classList.add('m-editor__body')

    this.bodyEl = bodyElement;

    root.appendChild(bodyElement);
  }
}
