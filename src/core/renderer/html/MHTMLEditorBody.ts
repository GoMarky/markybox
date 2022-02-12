import { toPixel } from '@/base/dom';
import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererBody } from '@/core/renderer/renderer';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/MHTMLEditorBodyTextarea';
import { MRow } from '@/core/objects/MRow';

const row = new MRow(-1);

export class MHTMLEditorBody extends MDomObject implements IRendererBody {
  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  public get el() {
    return this._el;
  }

  private getCurrentRow(): MRow {
    return row;
  }

  private onInput = (letter: string) => {
    const row = this.getCurrentRow();

    row.content.content += letter

    console.log(row.content.content);
  }

  private init(): void {
    const { root } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.style.height = toPixel(root.offsetHeight);
    bodyElement.classList.add('m-editor__body')

    this._el = bodyElement;

    root.appendChild(bodyElement);

    const textarea = new MHTMLEditorBodyTextarea(root);

    textarea.onDidUpdate(this.onInput);
  }
}
