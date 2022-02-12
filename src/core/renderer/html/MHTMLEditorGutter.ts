import { toPixel } from '@/base/dom';
import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererGutter } from '@/core/renderer/renderer';

export class MHTMLEditorGutter extends MDomObject implements IRendererGutter {
  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  private init(): void {
    const { root } = this;

    const gutterElement = document.createElement('div');
    gutterElement.style.width = toPixel(42);
    gutterElement.style.height = toPixel(root.offsetHeight);
    gutterElement.classList.add('m-editor__gutter')

    this._el = gutterElement;
    root.appendChild(gutterElement);
  }
}
