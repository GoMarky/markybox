import { MDomObject } from '@/core/renderer/html/MDomObject';
import { Emitter, IEvent } from '@/base/event';
import { toPixel } from '@/base/dom';

export class MHTMLEditorBodyTextarea extends MDomObject {
  private readonly _onDidUpdate: Emitter<string> = new Emitter<string>();
  public readonly onDidUpdate: IEvent<string> = this._onDidUpdate.event;

  constructor(private readonly root: HTMLElement) {
    super();

    const el = root.querySelector('textarea');

    if (!el) {
      throw new ReferenceError(`Textarea field must exist`);
    }

    this._el = el;

    this.init();
  }

  public setLeftPosition(x: number): void {
    this._el.style.left = toPixel(x);
  }

  private init(): void {
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
