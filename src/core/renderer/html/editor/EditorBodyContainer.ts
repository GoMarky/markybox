import { HTMLRenderer } from '@/core';
import { EditorBodyTextarea } from '@/core/renderer/html/editor/EditorBodyTextarea';
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
import { GolangCodeFormatter } from '@/core/formatters/golang/golang-formatter';
import { EditorStorage } from '@/core/renderer/html/system/EditorStorage';
import { EditorCSSName } from '@/core/renderer/html/common/helpers';
import { CriticalError } from '@/base/errors';
import { isUndefinedOrNull } from '@/base/types';
import { EditorGlobalContext } from '@/core/renderer/html/system/EditorGlobalContext';
import { GlyphDOMElement } from '@/core/renderer/html/common/GlyphDOMElement';

export type EditorLang = 'cpp' | 'python' | 'js' | 'json' | 'plain' | 'golang';

export type EditorTheme = 'light' | 'dark';

export interface IVisitor {
  visit(fragment: GlyphNodeFragment): void;
}

export class MHTMLEditorBody extends GlyphDOMElement<HTMLDivElement> {
  public readonly textLayer: TextContainerLayer;
  public readonly markerLayer: CurrentRowMarkerLayer;
  private readonly partitionLayer: MPartitionLayer;
  private readonly visitorMap: Map<string, IVisitor> = new Map();

  constructor(
    private readonly storage: EditorStorage,
    private readonly renderer: HTMLRenderer,
    private readonly context: EditorGlobalContext,
  ) {
    super();

    this.textLayer = new TextContainerLayer();
    this.markerLayer = new CurrentRowMarkerLayer();
    this.partitionLayer = new MPartitionLayer();

    this._formatter = new PlainFormatter(context);
  }

  private _formatter: BaseFormatter;
  public get formatter(): BaseFormatter {
    return this._formatter;
  }

  public get visitors(): IVisitor[] {
    return Array.from(this.visitorMap.values());
  }

  public setFormat(type: EditorLang = 'plain'): void {
    const { context } = this;

    switch (type) {
      case 'cpp':
        this._formatter = new CPPCodeFormatter(context);
        break;
      case 'js':
        this._formatter = new JavascriptCodeFormatter(context);
        break;
      case 'json':
        this._formatter = new JSONCodeFormatter(context);
        break;
      case 'python':
        this._formatter = new PythonCodeFormatter(context);
        break;
      case 'plain':
        this._formatter = new PlainFormatter(context);
        break;
      case 'golang':
        this._formatter = new GolangCodeFormatter(context);
        break;
      default:
        this._formatter = new PlainFormatter(context);
        console.warn(`Get unrecognized lang syntax value - ${type}.`)
        break;
    }

    if (this.storage.count) {
      this.reRenderExistNodes();
    }
  }

  public reRenderExistNodes(): void {
    const { storage: { rows } } = this;
    const keywordChecker = this.visitorMap.get('keyword');

    if (isUndefinedOrNull(keywordChecker)) {
      throw new CriticalError(`Keyword checker is undefined`);
    }

    for (const row of rows) {
      const { fragment } = row;

      if (isUndefinedOrNull(fragment)) {
        throw new CriticalError(`EditorBodyContainer#Expect fragment to be defined.`);
      }

      fragment.clearSyntaxClasses();
      keywordChecker.visit(fragment);
    }
  }

  public addVisitor(id: string, visitor: IVisitor): void {
    this.visitorMap.set(id, visitor);
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
    bodyElement.classList.add(EditorCSSName.Body)
    this._el = bodyElement;
    root.appendChild(bodyElement);
  }
}
