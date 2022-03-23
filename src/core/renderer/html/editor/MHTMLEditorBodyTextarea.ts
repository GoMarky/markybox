import { Emitter, IEvent } from '@/base/event';
import { toPixel } from '@/base/dom';
import { isSystemChar } from '@/core/renderer/common';
import { Char } from '@/base/char';
import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export type MChar = string;

export class MHTMLEditorBodyTextarea extends MHTMLGlyphDOM {
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

    window.addEventListener('keydown', (evt) => {
      const event = evt as KeyboardEvent;
      const { key } = event;

      const isSystemKey = isSystemChar(key as Char);

      if (isSystemKey) {
        return;
      }

      this._onDidUpdate.fire(key);
    })
  }
}
