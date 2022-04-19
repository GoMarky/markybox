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

    const useRightPosition = positions.length > 1;

    if (useRightPosition) {
      console.log('right');
    }

    for (const [index, { row, startColumn, endColumn }] of positions.entries()) {
      const position: IPosition = { row, column: startColumn };
      const isLastSelectionRow = (positions.length - 1) === index;
      const { left, top } = display.toDOMPosition(position);

      const element = createSelectionRowElement();
      const columnsDraw = endColumn - startColumn;

      const leftPixel = toPixel(left);
      const topPixel = toPixel(top);
      const widthPixel = toPixel(columnsDraw * 7.2);

      element.style.top = topPixel;
      element.style.left = leftPixel;

      if (useRightPosition) {
        if (isLastSelectionRow) {
          element.style.width = widthPixel;
        } else {
          element.style.right = toPixel(0);
        }
      } else {
        element.style.width = widthPixel;
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
