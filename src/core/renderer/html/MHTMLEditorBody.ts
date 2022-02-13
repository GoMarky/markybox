import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererBody } from '@/core/renderer/renderer';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/MHTMLEditorBodyTextarea';
import { MHTMLRenderer } from '@/core';

export class MHTMLEditorBody extends MDomObject implements IRendererBody {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  private onInput = (letter: string) => {
    const row = this.renderer.editor.getCurrentRow();

    row.content.content += letter;

    console.log(row.content.content);
  }

  private init(): void {
    const { renderer: { root } } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__body')

    this._el = bodyElement;

    root.appendChild(bodyElement);

    const textarea = new MHTMLEditorBodyTextarea(root);

    textarea.onDidUpdate(this.onInput);
  }
}
