import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { IPosition } from '@/core/renderer/common';
import { removeChildren, toPixel } from '@/base/dom';
import { createSelectionRowElement } from '@/core/renderer/html/common/helpers';
import { MHTMLRenderer } from '@/core';

export class MSelectionRowLayer extends MDomObject {
  constructor() {
    super();
  }
}

export class MSelectionLayer extends MLayer {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  public addSelectionRow(position: IPosition): void {
    const { el } = this;
    removeChildren(el);

    const { left, top } = this.renderer.toDOMPosition(position);

    const element = createSelectionRowElement();
    element.style.left = toPixel(left);
    element.style.top = toPixel(top);
    element.style.right = toPixel(0);

    this._el.appendChild(element);
  }

  private init(): void {
    const { renderer } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__layer-selection')
    this._el = bodyElement;
    renderer.body.el.appendChild(bodyElement);
  }
}
