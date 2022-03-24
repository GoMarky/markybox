import { MHTMLRenderer } from '@/core';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';

export interface IVisitor {
  visit(fragment: MHTMLNodeFragment): void;
}

export class MHTMLEditorBody extends MHTMLGlyphDOM {
  private textarea: MHTMLEditorBodyTextarea;

  public visitors: IVisitor[] = [];

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  public addVisitor(visitor: IVisitor): void {
    this.visitors.push(visitor);
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
