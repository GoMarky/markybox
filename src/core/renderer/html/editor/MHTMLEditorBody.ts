import { IRendererBody } from '@/core/renderer/renderer';
import { MHTMLRenderer } from '@/core';
import { removeLastLetter } from '@/base/string';
import { splitAtIndex } from '@/core/renderer/common';
import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';

export class MHTMLEditorBody extends MDomObject implements IRendererBody {
  private textarea: MHTMLEditorBodyTextarea;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  public removeLastLetterFromCurrentRow(): void {
    //
  }

  private onInput = (_letter: string) => {
    const { row, column } = this.renderer.navigator.position;
    const currentRow = this.renderer.storage.at(row);

    if (!currentRow) {
      return;
    }

    // const { content } = currentRow;
    // const { text } = content;
    // const [first, last] = splitAtIndex(column)(text);
    // const rawText = first + letter + last;
    //
    // const keywords = this.renderer.formatter.parseKeywords(rawText);
    //
    // currentRow.content.setContentWithFormat(keywords)
    //
    //
    // const x = currentRow.width + 40;
    // this.textarea.setLeftPosition(x);
    // this.renderer.navigator.setPosition({ row, column: column + 1 });
  }

  private init(): void {
    const { renderer } = this;
    const { currentState, root } = renderer;

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
