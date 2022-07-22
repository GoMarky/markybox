import { BaseLayer } from '@/core/renderer/layers/BaseLayer';
import { HTMLRenderer } from '@/core';
import { toPixel } from '@/base/dom';
import { EditorCSSName } from '@/core/renderer/common/helpers';

export class MPartitionLayer extends BaseLayer {
  constructor() {
    super();
  }

  public mount(body: HTMLElement): void {
    // создаем элемент
    this.createPartitionElement();
    body.appendChild(this._el);

    this._el.style.left = toPixel(676);
  }

  private createPartitionElement(): void {
    const partitionElement = document.createElement('div');
    partitionElement.classList.add(EditorCSSName.Layer);
    partitionElement.classList.add(EditorCSSName.LayerPartition)

    this._el = partitionElement;
  }
}
