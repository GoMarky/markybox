import { MObject } from '@/core/objects/MObject';
import { MDomObject } from '@/core/renderer/html/MDomObject';
import { IParsedFormatterWord } from '@/core/formatters/common';

class MRowContent extends MObject {
  private _text = '';

  constructor(private readonly row: MRow) {
    super();
  }

  public setContentWithFormat(keywords: IParsedFormatterWord[]): void {
    const { el } = this.row;

    let text = '';

    // TODO: edit elements, instead of removing
    MRowContent.removeAllElements(el);

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

  private static removeAllElements(element: HTMLElement): void {
    Array.from(element.children).forEach((element) => element.remove());
  }

  private static createSpanElement(data: string, className: string): HTMLElement {
    const element = document.createElement('span');
    element.classList.add(className);
    element.textContent = data;

    return element;
  }
}

export class MRow extends MDomObject {
  public readonly content: MRowContent;

  constructor(
    public readonly layer: HTMLElement,
    public readonly index: number
  ) {
    super();

    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row')

    this._el = rowElement;
    layer.appendChild(this._el);

    this.content = new MRowContent(this);
  }

  public get columns(): number {
    return this._el.textContent?.length || 0;
  }

  public get width(): number {
    return this._el.offsetWidth;
  }
}
