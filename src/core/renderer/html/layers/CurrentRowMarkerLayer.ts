import { BaseLayer } from '@/core/renderer/html/layers/BaseLayer';

export class CurrentRowMarkerLayer extends BaseLayer {
  constructor() {
    super();
  }

  private createActiveLine(): void {
    const lineElement = document.createElement('div');
    lineElement.classList.add('m-editor__layer-marker-active-line');

    this._el.appendChild(lineElement);
  }

  public mount(body: HTMLElement): void {
    const layerElement = document.createElement('div');
    layerElement.classList.add('m-editor__layer');
    layerElement.classList.add('m-editor__layer-marker')
    this._el = layerElement;
    body.appendChild(layerElement);

    this.createActiveLine();
  }
}
