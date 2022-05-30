import { MHTMLRenderer } from '@/core';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { BaseFormatter } from '@/core/formatters/formatter/base-formatter';
import { PlainFormatter } from '@/core/formatters/plain/plain-formatter';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import { JSONCodeFormatter } from '@/core/formatters/json/json-formatter';
import { PythonCodeFormatter } from '@/core/formatters/python/python-formatter';

export type EditorLang = 'cpp' | 'python' | 'js' | 'json' | 'plain';

export type EditorTheme = 'light' | 'dark';

export interface IVisitor {
  visit(fragment: MHTMLNodeFragment): void;
}

export class MHTMLEditorBody extends MHTMLGlyphDOM<HTMLDivElement> {
  private textarea: MHTMLEditorBodyTextarea;
  private _formatter: BaseFormatter;

  public visitors: IVisitor[] = [];

  constructor(
    private readonly renderer: MHTMLRenderer,
    format: EditorLang = 'plain'
  ) {
    super();

    this.init(format);
  }

  public getCurrentLanguage(): string {
    return this._formatter.toString();
  }

  public getAvailableLanguages(): EditorLang[] {
    return [
      'plain',
      'python',
      'cpp',
    ]
  }

  public get formatter(): BaseFormatter {
    return this._formatter;
  }

  public setFormat(type: EditorLang): void {
    switch (type) {
      case 'plain': {
        this._formatter = new PlainFormatter();
        break;
      }
      case 'js': {
        this._formatter = new JavascriptCodeFormatter();
        break;
      }
      case 'json': {
        this._formatter = new JSONCodeFormatter();
        break;
      }
      case 'python': {
        this._formatter = new PythonCodeFormatter();
        break;
      }
    }
  }

  public addVisitor(visitor: IVisitor): void {
    this.visitors.push(visitor);
  }

  private init(format: EditorLang): void {
    const { renderer } = this;
    const { root } = renderer;
    this.createHTMLElement();

    this.setFormat(format);

    const textarea = new MHTMLEditorBodyTextarea(root);
    this.textarea = textarea;
    textarea.onDidUpdate((letter) => this.renderer.currentState.onInput(letter));
  }

  private createHTMLElement(): void {
    const { renderer } = this;
    const { root } = renderer;

    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__body')
    this._el = bodyElement;
    root.appendChild(bodyElement);
  }
}
