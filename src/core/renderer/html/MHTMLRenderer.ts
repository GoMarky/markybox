import { MObject } from '@/core/objects/MObject';
import { DisposableStore } from '@/platform/lifecycle/common/lifecycle';
import { IAbstractRenderer } from '@/core/renderer/renderer';
import { MRow } from '@/core/objects/MRow';
import { toPixel } from '@/base/dom';
import { MGutter } from '@/core/renderer/html/MGutter';

export interface IDisplayRenderer {
  setFullScreen(): void;
}

class HTMLDisplayRenderer extends MObject implements IDisplayRenderer {
  constructor(private readonly root: HTMLElement) {
    super();
  }

  public setFullScreen(): void {
    const { innerWidth, innerHeight } = window;

    this.root.style.width = toPixel(innerWidth);
    this.root.style.height = toPixel(innerHeight);
  }
}

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  private readonly disposables: DisposableStore = new DisposableStore();

  public readonly display: IDisplayRenderer;
  public readonly gutter: MGutter;

  constructor(private readonly root: HTMLElement) {
    super();

    this.display = new HTMLDisplayRenderer(root);
    this.gutter = new MGutter(root);

    this.registerListeners();
  }

  public render() {
    const { root } = this;
  }

  private registerListeners(): void {
    this.root.addEventListener('click', (event) => {
      console.log(event);
    })
  }
}
