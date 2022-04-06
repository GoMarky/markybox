import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { IPosition } from '@/core/app/common';
import { removeChildren, toPixel } from '@/base/dom';
import { createSelectionRowElement } from '@/core/renderer/html/common/helpers';
import { MHTMLRenderer } from '@/core';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { ISelectionPosition } from '@/core/renderer/html/editor/MHTMLEditorSelection';

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

  public addSelectionRows(positions: readonly ISelectionPosition[]): void {
    const { renderer } = this;
    const { display } = renderer;
    this.clear();

    for (const { row, startColumn, endColumn } of positions) {
      const _position: IPosition = { row, column: startColumn }

      const { left, top } = display.toDOMPosition(_position);

      const element = createSelectionRowElement();
      element.style.left = toPixel(left);
      element.style.top = toPixel(top);

      if (endColumn) {
        const right = endColumn * 7.2;
        element.style.width = toPixel(right);
      } else {
        element.style.right = toPixel(0);
      }

      this._el.appendChild(element);
    }
  }

  public clear(): void {
    const { el } = this;

    removeChildren(el);
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
