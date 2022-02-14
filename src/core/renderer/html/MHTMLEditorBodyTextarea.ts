import { MDomObject } from '@/core/renderer/html/MDomObject';
import { Emitter, IEvent } from '@/base/event';
import { toPixel } from '@/base/dom';

export class MHTMLEditorBodyTextarea extends MDomObject {
  private readonly _onDidUpdate: Emitter<string> = new Emitter<string>();
  public readonly onDidUpdate: IEvent<string> = this._onDidUpdate.event;

  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
  }

  public setLeftPosition(x: number): void {
    this._el.style.left = toPixel(x);
  }

  private createTextareaElement(): void {
    const { root } = this;

    const element = document.createElement('textarea');

    element.setAttribute('wrap', 'off');
    element.setAttribute('autocapitalize', 'off');
    element.setAttribute('autocorrect', 'off');
    element.setAttribute('spellcheck', 'false');
    element.classList.add('marky__textarea')

    root.appendChild(element);
    this._el = element;
  }

  private init(): void {
    this.createTextareaElement();

    const { _el } = this;

    this._el.style.left = toPixel(42);

    _el.addEventListener('input', (evt) => {
      const event = evt as InputEvent;
      const { data } = event;
      const str = data as string;

      this._onDidUpdate.fire(str);
    })
  }
}
