import { MObject } from '@/core/objects/MObject';
import { toPixel } from '@/base/dom';
import { MHTMLRenderer } from '@/core';
import { IPosition } from '@/core/app/common';
import { IDOMPosition } from '@/core/renderer/html/common/helpers';
import { IRendererDisplay } from '@/core/app/renderer';
import { debounce } from '@/base/async';
import { MHTMLEditorGutter } from '@/core/renderer/html/editor/MHTMLEditorGutter';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { MMarkerLayer } from '@/core/renderer/html/layers/MMarkerLayer';
import { MPartitionLayer } from '@/core/renderer/html/layers/MPartionLayer';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';

const EDITOR_OFFSET_POSITION: IDOMPosition = {
  top: 52,
  left: 42,
}

export class MHTMLDisplayRenderer extends MObject implements IRendererDisplay {
  public readonly gutter: MHTMLEditorGutter;
  public readonly textLayer: MTextLayer;
  public readonly markerLayer: MMarkerLayer;
  private readonly partitionLayer: MPartitionLayer;

  constructor(
    private readonly root: HTMLElement,
    private readonly body: HTMLElement,
    private readonly storage: MHTMLStorage,
    private readonly navigator: MHTMLEditorBodyNavigator,
  ) {
    super();

    this.gutter = new MHTMLEditorGutter(root);
    this.textLayer = new MTextLayer(body);
    this.markerLayer = new MMarkerLayer(body, navigator, this);
    this.partitionLayer = new MPartitionLayer(body);

    this.registerListeners();
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

    top += document.documentElement.scrollTop - EDITOR_OFFSET_POSITION.top;
    left -= EDITOR_OFFSET_POSITION.left;

    return {
      row: Math.round(top / 16),
      column: Math.round(left / 7.2),
    }
  }

  public setFullScreen(): void {
    const { innerWidth, innerHeight } = window;
    const { root } = this;

    root.style.width = toPixel(innerWidth);
    root.style.height = toPixel(innerHeight);
  }

  private registerListeners(): void {
    const { storage, root } = this;

    const debounced = debounce(() => {
      const { count } = storage;
      const { innerHeight } = window;

      const totalRowsHeight = count * 16;
      const rootHeight = totalRowsHeight > innerHeight ? totalRowsHeight : innerHeight;

      root.style.height = toPixel(rootHeight);
    }, 250);

    storage.onDidUpdate(debounced)
  }
}
