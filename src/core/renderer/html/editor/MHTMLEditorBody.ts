import { MHTMLRenderer } from '@/core';
import { MHTMLEditorBodyTextarea } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { BaseFormatter } from '@/core/formatters/formatter/base-formatter';
import { PlainFormatter } from '@/core/formatters/plain/plain-formatter';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import { JSONCodeFormatter } from '@/core/formatters/json/json-formatter';
import { PythonCodeFormatter } from '@/core/formatters/python/python-formatter';
import { CPPCodeFormatter } from '@/core/formatters/cpp/cpp-formatter';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { MMarkerLayer } from '@/core/renderer/html/layers/MMarkerLayer';
import { MPartitionLayer } from '@/core/renderer/html/layers/MPartionLayer';
import { MHTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';

export type EditorLang = 'cpp' | 'python' | 'js' | 'json' | 'plain';

export type EditorTheme = 'light' | 'dark';

export interface IVisitor {
  visit(fragment: MHTMLNodeFragment): void;
}

export class MHTMLEditorBody extends MHTMLGlyphDOM<HTMLDivElement> {
  public readonly textLayer: MTextLayer;
  private readonly markerLayer: MMarkerLayer;
  private readonly partitionLayer: MPartitionLayer;

  public visitors: IVisitor[] = [];

  constructor(
    private readonly display: MHTMLDisplayRenderer,
    private readonly navigator: MHTMLEditorBodyNavigator,
    private readonly renderer: MHTMLRenderer,
  ) {
    super();

    this.textLayer = new MTextLayer();
    this.markerLayer = new MMarkerLayer();
    this.partitionLayer = new MPartitionLayer();

    this.navigator.onDidUpdatePosition((position) => {
      const { top } = this.display.toDOMPosition(position);

      this.markerLayer.top(top);
    })
  }

  private _formatter: BaseFormatter = new JavascriptCodeFormatter();
  public get formatter(): BaseFormatter {
    return this._formatter;
  }

  public get currentLang(): string {
    return this._formatter.toString();
  }

  public setFormat(type: EditorLang = 'plain'): void {
    switch (type) {
      case 'cpp':
        this._formatter = new CPPCodeFormatter();
        break;
      case 'plain':
        this._formatter = new PlainFormatter();
        break;
      case 'js':
        this._formatter = new JavascriptCodeFormatter();
        break;
      case 'json':
        this._formatter = new JSONCodeFormatter();
        break;
      case 'python':
        this._formatter = new PythonCodeFormatter();
        break;
    }
  }

  public addVisitor(visitor: IVisitor): void {
    this.visitors.push(visitor);
  }

  public mount(root: HTMLElement): void {
    this.createHTMLElement(root);

    const body = this._el;

    this.textLayer.mount(body);
    this.markerLayer.mount(body);
    this.partitionLayer.mount(body)

    const textarea = new MHTMLEditorBodyTextarea(root);
    textarea.onDidUpdate((letter) => this.renderer.currentState.onInput(letter));
  }

  private createHTMLElement(root: HTMLElement): void {
    const bodyElement = document.createElement('div');
    bodyElement.style.width = '100%';
    bodyElement.classList.add('m-editor__body')
    this._el = bodyElement;
    root.appendChild(bodyElement);
  }
}
