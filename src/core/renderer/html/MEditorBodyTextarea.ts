import { MDomObject } from '@/core/renderer/html/MDomObject';

export class MEditorBodyTextarea extends MDomObject {
  constructor(private readonly root: HTMLElement) {
    super();

    const el = root.querySelector('textarea');

    if (!el) {
      throw new ReferenceError(`Textarea field must exist`);
    }

    this._el = el;

    this.init();
  }

  private init(): void {
    const { _el } = this;

    _el.addEventListener('input', (evt) => {
      const event = evt as InputEvent;

      const { data } = event;
    })
  }
}
