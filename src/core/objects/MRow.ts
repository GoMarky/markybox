import { MObject } from '@/core/objects/MObject';
import { MDomObject } from '@/core/renderer/html/MDomObject';

class MRowContent extends MObject {
  private _text = '';

  constructor(private readonly row: MRow) {
    super();
  }

  public setContent(data: string) {
    this._text = data;

    this.row.el.textContent = data;
  }

  public get text(): string {
    return this._text;
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
