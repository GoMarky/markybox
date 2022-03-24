import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MHTMLRenderer } from '@/core';
import { toPixel } from '@/base/dom';

export class MPartitionLayer extends MLayer {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  private init(): void {
    const { renderer } = this;

    // создаем элемент
    this.createPartitionElement();
    renderer.body.el.appendChild(this._el);

    this._el.style.left = toPixel(676);
  }

  private createPartitionElement(): void {
    const partitionElement = document.createElement('div');
    partitionElement.classList.add('m-editor__layer');
    partitionElement.classList.add('m-editor__layer-partition')

    this._el = partitionElement;
  }
}
