import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererBody } from '@/core/renderer/renderer';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/MHTMLEditorBodyTextarea';
import { MHTMLRenderer } from '@/core';
import { removeLastLetter } from '@/base/string';

export class MHTMLEditorBody extends MDomObject implements IRendererBody {
  private textarea: MHTMLEditorBodyTextarea;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  public removeLastLetterFromCurrentRow(): void {
    const currentRow = this.renderer.editor.getCurrentRow();
    const { text } = currentRow.content

    currentRow.content.setContent(removeLastLetter(text))
  }

  private onInput = (letter: string) => {
    const currentRow = this.renderer.editor.getCurrentRow();
    const rawText = currentRow.content.text + letter;

    currentRow.content.setContent(rawText);

    const x = currentRow.width + 40;

    console.log(x);

    this.textarea.setLeftPosition(x);
    this.renderer.caretLayer.setPosition({ row: 0, column: rawText.length });
  }

  private init(): void {
    const { renderer: { root } } = this;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__body')
    this._el = bodyElement;
    root.appendChild(bodyElement);

    const textarea = new MHTMLEditorBodyTextarea(root);
    this.textarea = textarea;
    textarea.onDidUpdate(this.onInput);
  }
}
