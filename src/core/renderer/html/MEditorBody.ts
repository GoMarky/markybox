import { toPixel } from '@/base/dom';
import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererBody } from '@/core/renderer/renderer';

export class MEditorBody extends MDomObject implements IRendererBody{
  public get el() {
    return this._el;
  }

  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  private init(): void {
    const { root } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.style.height = toPixel(root.offsetHeight);
    bodyElement.classList.add('m-editor__body')

    this._el = bodyElement;

    root.appendChild(bodyElement);
  }
}
