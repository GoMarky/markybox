import { MLayer } from '@/core/renderer/html/layers/MLayer';
import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { IPosition } from '@/core/renderer/common';

export class MSelectionRowLayer extends MDomObject {
  constructor() {
    super();
  }
}

export class MSelectionLayer extends MLayer {
  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  public addSelectionRow(position: IPosition): void {
    console.log(position);
  }

  private init(): void {
    const { root } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__layer-selection')
    this._el = bodyElement;
    root.appendChild(bodyElement);
  }
}
