import { MObject } from '@/core/objects/MObject';
import { MDomObject } from '@/core/renderer/html/MDomObject';
import { toPixel } from '@/base/dom';

class MRowContent extends MObject {
  private _content = '';

  constructor(private readonly row: MRow) {
    super();
  }

  public set content(data: string) {
    this._content = data;

    this.row.el.textContent = data;
  }

  public get content(): string {
    return this._content;
  }
}

export class MRow extends MDomObject {
  public readonly content: MRowContent;

  constructor(
    public readonly root: HTMLElement,
    public readonly index: number
  ) {
    super();

    const rowElement = document.createElement('div');
    rowElement.classList.add('m-editor__row')

    this._el = rowElement;
    root.appendChild(this._el);

    this.content = new MRowContent(this);
  }
}
