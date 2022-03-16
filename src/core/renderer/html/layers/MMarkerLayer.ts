import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MHTMLRenderer } from '@/core';
import { toPixel } from '@/base/dom';

export class MMarkerLayer extends MLayer {
  private _line: HTMLDivElement;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  private createActiveLine(): void {
    const lineElement = document.createElement('div');
    lineElement.classList.add('m-editor__layer-marker-active-line');

    this._line = lineElement;

    this._el.appendChild(lineElement);
  }

  private init(): void {
    const { renderer } = this;
    const { navigator, display } = renderer;

    const layerElement = document.createElement('div');
    layerElement.classList.add('m-editor__layer');
    layerElement.classList.add('m-editor__layer-marker')
    this._el = layerElement;
    renderer.body.el.appendChild(layerElement);

    this.createActiveLine();

    navigator.onDidUpdatePosition((position) => {
      const { top } = display.toDOMPosition(position);

      this._line.style.top = toPixel(top);
    })
  }
}
