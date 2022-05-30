import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { toPixel } from '@/base/dom';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';

export class MMarkerLayer extends MLayer {
  private _line: HTMLDivElement;

  constructor(
    private readonly body: HTMLElement,
    private readonly navigator: MHTMLEditorBodyNavigator,
    private readonly display: MHTMLDisplayRenderer) {
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
    const { navigator, display, body } = this;

    const layerElement = document.createElement('div');
    layerElement.classList.add('m-editor__layer');
    layerElement.classList.add('m-editor__layer-marker')
    this._el = layerElement;
    body.appendChild(layerElement);

    this.createActiveLine();

    navigator.onDidUpdatePosition((position) => {
      const { top } = display.toDOMPosition(position);

      this._line.style.top = toPixel(top);
    })
  }
}
