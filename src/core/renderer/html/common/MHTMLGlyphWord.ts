import { MGlyph } from '@/core/objects/MGlyph';

export class MHTMLGlyphWord extends MGlyph {
  private _text: string = '';
  private readonly _el: HTMLSpanElement;

  constructor(public startColumn: number, public endColumn: number) {
    super();

    const element = document.createElement('span');
    element.classList.add('m-editor__plain');

    this._el = element;
  }

  public set text(data: string) {
    this._text = data;

    this.draw();
  }

  public get el(): HTMLElement {
    return this._el;
  }

  public get text(): string {
    return this._text;
  }

  public draw(): void {
    this._el.textContent = this.text;
  }
}
