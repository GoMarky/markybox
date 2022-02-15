import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IRendererBody } from '@/core/renderer/renderer';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/MHTMLEditorBodyTextarea';
import { MHTMLRenderer } from '@/core';
import { removeLastLetter } from '@/base/string';
import { splitAtIndex } from '@/core/renderer/common';

export class MHTMLEditorBody extends MDomObject implements IRendererBody {
  private textarea: MHTMLEditorBodyTextarea;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  public removeLastLetterFromCurrentRow(): void {
    const currentRow = this.renderer.editor.getCurrentRow();
    const { text } = currentRow.content;

    const formattedText = removeLastLetter(text);

    const keywords = this.renderer.editor.formatter.parseKeywords(formattedText);

    currentRow.content.setContentWithFormat(keywords)
  }

  private onInput = (letter: string) => {
    const { row, column } = this.renderer.navigator.position;
    const currentRow = this.renderer.editor.getRowByPosition(row);
    const { content } = currentRow;
    const { text } = content;

    const [first, last] = splitAtIndex(column)(text);
    const rawText = first + letter + last;

    const keywords = this.renderer.editor.formatter.parseKeywords(rawText);

    currentRow.content.setContentWithFormat(keywords)


    const x = currentRow.width + 40;
    this.textarea.setLeftPosition(x);
    this.renderer.navigator.setPosition({ row, column: column + 1 });
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
