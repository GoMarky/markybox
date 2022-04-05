import { MObject } from '@/core/objects/MObject';
import { toPixel } from '@/base/dom';
import { MHTMLRenderer } from '@/core';
import { IPosition } from '@/core/app/common';
import { IDOMPosition } from '@/core/renderer/html/common/helpers';
import { IRendererDisplay } from '@/core/app/renderer';

// TODO: do not use clientX
const EDITOR_OFFSET_POSITION: IDOMPosition = {
  top: 45,
  left: 42,
}

export class HTMLDisplayRenderer extends MObject implements IRendererDisplay {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  public toDOMPosition(position: IPosition): IDOMPosition {
    const { row, column } = position;

    return {
      top: row * 16,
      left: column * 7.2,
    }
  }

  public toEditorPosition(position: IDOMPosition): IPosition {
    let { top, left } = position;

    top -= EDITOR_OFFSET_POSITION.top;
    left -= EDITOR_OFFSET_POSITION.left;

    return {
      row: Math.round(top / 16),
      column: Math.round(left / 7.2),
    }
  }

  public setFullScreen(): void {
    const { innerWidth, innerHeight } = window;
    const { root } = this.renderer;

    root.style.width = toPixel(innerWidth);
    root.style.height = toPixel(innerHeight);
  }
}
