import { MObject } from '@/core/objects/MObject';
import { IParsedFormatterWord } from '@/core/formatters/common';
import { MDomObject } from '@/core/renderer/html/common/MDomObject';
import { removeChildren } from '@/base/dom';
import { MGlyph } from '@/core/objects/MGlyph';

class MRowContent extends MObject {
  private _text = '';

  constructor(private readonly row: MHTMLGlyphRow) {
    super();
  }

  public setContentWithFormat(keywords: IParsedFormatterWord[]): void {
    const { el } = this.row;

    let text = '';

    // TODO: edit elements, instead of removing
    removeChildren(el);

    for (const { className, data } of keywords) {
      text += data;

      const element = MRowContent.createSpanElement(data, className);
      this.row.el.appendChild(element);
    }

    this._text = text;
  }

  public get text(): string {
    return this._text;
  }

  private static createSpanElement(data: string, className: string): HTMLElement {
    const element = document.createElement('span');
    element.classList.add(className);
    element.textContent = data;

    return element;
  }
}

export class MHTMLGlyphRow extends MDomObject {
  private _children: MGlyph[] = [];

  constructor(
    public readonly layer: HTMLElement,
    public readonly index: number
  ) {
    super();

    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row')

    this._el = rowElement;
    layer.appendChild(this._el);
  }

  public get children(): MGlyph[] {
    return this._children;
  }

  public insert(glyph: MGlyph): void {
    this._children.push(glyph);

    this.draw();
  }

  public remove(glyph: MGlyph): void {
    this._children = this._children.filter((child) => child !== glyph);

    this.draw();
  }

  public draw(): void {

  }

  public get columns(): number {
    return this._el.textContent?.length || 0;
  }

  public get width(): number {
    return this._el.offsetWidth;
  }
}
