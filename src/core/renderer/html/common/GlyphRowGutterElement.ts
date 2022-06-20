import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';
import { toPixel } from '@/base/dom';
import { HTMLRenderer } from '@/core';
import { toDisposable } from '@/platform/lifecycle/common/lifecycle';

export class GlyphRowGutterElement extends GlyphDOMNode<HTMLSpanElement> {
  private _expandable: boolean = false;
  private _widgetElement: HTMLSpanElement;

  constructor(private readonly renderer: HTMLRenderer, private _index: number) {
    super();

    const element = document.createElement('span');
    element.classList.add('m-editor__gutter-cell');
    element.style.height = toPixel(16);

    this._el = element;
    this.render();
  }

  public get index(): number {
    return this._index;
  }

  public set index(value) {
    this._index = value;
    this.render();
  }

  public get expandable(): boolean {
    return this._expandable;
  }

  public set expandable(value) {
    this._expandable = value;
    this.render();
  }

  private createExpandableWidget(): void {
    this._widgetElement?.remove();

    const widgetElement = document.createElement('span');
    widgetElement.classList.add('m-editor__gutter-cell-widget');
    widgetElement.style.height = toPixel(16);
    this._el.appendChild(widgetElement);
    this._widgetElement = widgetElement;

    this._el.addEventListener('click', this.onClick);

    this.disposables.add(toDisposable(() => this._el.removeEventListener('click', this.onClick)));
  }

  private onClick = (): void => {
    const { index, renderer } = this;
    const { controller } = renderer;

    controller.expandOrShrinkRow(index);
  }

  private render(): void {
    const { index, expandable } = this;

    this._el.textContent = (index + 1).toString();

    if (expandable) {
      this.createExpandableWidget();
    }
  }

  public dispose(): void {
    this._el.removeEventListener('click', this.onClick);
    this._el.remove();
  }
}
