import { Emitter, IEvent } from '@/base/event';
import { toPixel } from '@/base/dom';
import { Char } from '@/base/char';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { isSystemChar } from '@/core/app/common';

export type MChar = string;

export class MHTMLEditorBodyTextarea extends MHTMLGlyphDOM<HTMLTextAreaElement> {
  private readonly _onDidUpdate: Emitter<string> = new Emitter<string>();
  public readonly onDidUpdate: IEvent<string> = this._onDidUpdate.event;

  constructor(private readonly root: HTMLElement) {
    super();

    this.init();
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
    _el.style.left = toPixel(42);

    this._el.addEventListener('keydown', (evt) => {
      console.log(evt);
    })

    window.addEventListener('keydown', (evt) => {
      const event = evt as KeyboardEvent;

      if (event.defaultPrevented) {
        return;
      }

      const { key, code } = event;
      const isSystemKey = isSystemChar(key as Char);

      if (isSystemKey || key === 'Tab') {
        evt.preventDefault();
        return;
      }

      if (code === 'Space') {
        event.preventDefault();
      }

      this._onDidUpdate.fire(key);
    })
  }
}
