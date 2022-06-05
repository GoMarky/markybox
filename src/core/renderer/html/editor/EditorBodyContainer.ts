import { HTMLRenderer } from '@/core';
import { EditorBodyTextarea } from '@/core/renderer/html/editor/EditorBodyTextarea';
import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';
import { GlyphNodeFragment } from '@/core/renderer/html/common/GlyphNodeFragment';
import { BaseFormatter } from '@/core/formatters/formatter/base-formatter';
import { PlainFormatter } from '@/core/formatters/plain/plain-formatter';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';
import { JSONCodeFormatter } from '@/core/formatters/json/json-formatter';
import { PythonCodeFormatter } from '@/core/formatters/python/python-formatter';
import { CPPCodeFormatter } from '@/core/formatters/cpp/cpp-formatter';
import { TextContainerLayer } from '@/core/renderer/html/layers/TextContainerLayer';
import { CurrentRowMarkerLayer } from '@/core/renderer/html/layers/CurrentRowMarkerLayer';
import { MPartitionLayer } from '@/core/renderer/html/layers/UserPartitionLayer';
import { EditorDisplayController } from '@/core/renderer/html/system/EditorDisplayController';
import { EditorBodyNavigator } from '@/core/renderer/html/editor/EditorBodyNavigator';
import { GolangCodeFormatter } from '@/core/formatters/golang/golang-formatter';

export type EditorLang = 'cpp' | 'python' | 'js' | 'json' | 'plain' | 'golang';

export type EditorTheme = 'light' | 'dark';

export interface IVisitor {
  visit(fragment: GlyphNodeFragment): void;
}

export class MHTMLEditorBody extends GlyphDOMNode<HTMLDivElement> {
  public readonly textLayer: TextContainerLayer;
  private readonly markerLayer: CurrentRowMarkerLayer;
  private readonly partitionLayer: MPartitionLayer;

  public visitors: IVisitor[] = [];

  constructor(
    private readonly display: EditorDisplayController,
    private readonly navigator: EditorBodyNavigator,
    private readonly renderer: HTMLRenderer,
  ) {
    super();

    this.textLayer = new TextContainerLayer();
    this.markerLayer = new CurrentRowMarkerLayer();
    this.partitionLayer = new MPartitionLayer();

    this.navigator.onDidUpdatePosition((position) => {
      const { top } = this.display.toDOMPosition(position);

      this.markerLayer.top(top);
    })
  }

  private _formatter: BaseFormatter = new PlainFormatter();
  public get formatter(): BaseFormatter {
    return this._formatter;
  }

  public setFormat(type: EditorLang = 'plain'): void {
    switch (type) {
      case 'cpp':
        this._formatter = new CPPCodeFormatter();
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
      case 'plain':
        this._formatter = new PlainFormatter();
        break;
      case 'golang':
        this._formatter = new GolangCodeFormatter();
        break;
      default:
        this._formatter = new PlainFormatter();
        console.warn(`Get unrecognized lang syntax value - ${type}.`)
        break;
    }

    this.renderer.currentState.setContext(this.renderer);
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

    const textarea = new EditorBodyTextarea(root);
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
