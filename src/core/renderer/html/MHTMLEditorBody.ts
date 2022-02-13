import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererBody } from '@/core/renderer/renderer';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/MHTMLEditorBodyTextarea';
import { MRow } from '@/core/objects/MRow';

export class MHTMLEditorBody extends MDomObject implements IRendererBody {
  private _currentRow: MRow;

  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  private getCurrentRow(): MRow {
    return this._currentRow;
  }

  private onInput = (letter: string) => {
    const row = this.getCurrentRow();

    row.content.content += letter;

    console.log(row.content.content);
  }

  private init(): void {
    const { root } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__body')

    this._el = bodyElement;

    root.appendChild(bodyElement);

    const textarea = new MHTMLEditorBodyTextarea(root);

    textarea.onDidUpdate(this.onInput);
  }
}
