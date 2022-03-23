import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { IPosition } from '@/core/app/common';
import { removeChildren, toPixel } from '@/base/dom';
import { createSelectionRowElement } from '@/core/renderer/html/common/helpers';
import { MHTMLRenderer } from '@/core';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export class MSelectionRowLayer extends MHTMLGlyphDOM {
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
    const { el, renderer } = this;
    const { display } = renderer;
    removeChildren(el);

    const { left, top } = display.toDOMPosition(position);

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
