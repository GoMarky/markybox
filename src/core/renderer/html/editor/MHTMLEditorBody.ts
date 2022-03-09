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

  private init(): void {
    const { renderer } = this;
    const { root } = renderer;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__body')
    this._el = bodyElement;
    root.appendChild(bodyElement);

    const textarea = new MHTMLEditorBodyTextarea(root);
    this.textarea = textarea;
    textarea.onDidUpdate((letter) => this.renderer.currentState.onInput(letter));
  }
}
