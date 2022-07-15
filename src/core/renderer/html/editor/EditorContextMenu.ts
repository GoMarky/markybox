import { Disposable, toDisposable } from '@/platform/lifecycle/common/lifecycle';
import { EditorGlobalContext } from '@/core/renderer/html/system/EditorGlobalContext';
import { GlyphDOMElement } from '@/core/renderer/html/common/GlyphDOMElement';
import { IPosition } from '@/core/app/common';
import { EditorCSSName } from '@/core/renderer/html/common/helpers';
import { ContextMenuLayer } from '@/core/renderer/html/layers/ContextMenuLayer';
import { removeChildren } from '@/base/dom';

export interface IContextMenuItem {
  title: string;
  action: () => void;
}

class ContextMenuItem extends GlyphDOMElement {
  constructor(
    private readonly title: string,
    private readonly action: () => void,
  ) {
    super();

    const button = this._el = document.createElement('button');
    button.classList.add(EditorCSSName.ContextMenubarItemContent);

    const titleContainer = document.createElement('div');
    titleContainer.classList.add(EditorCSSName.ContextMenubarItemTitle);
    button.appendChild(titleContainer);

    const text = document.createElement('span');
    text.classList.add(EditorCSSName.ContextMenuBarItemText);
    text.textContent = title;
    titleContainer.appendChild(text);

    this.registerListeners();
  }

  private registerListeners(): void {
    const onClick = () => {
      Reflect.apply(this.action, undefined, []);
    }

    this._el.addEventListener('click', onClick);
    this.disposables.add(toDisposable(() => this.el.removeEventListener('click', onClick)));
  }
}

class CustomContextMenubar extends GlyphDOMElement {
  constructor(private readonly items: IContextMenuItem[]) {
    super();

    this._el = document.createElement('div');
    this._el.classList.add(EditorCSSName.LayerContextMenubarList);
    this.create();
  }

  private create(): void {
    const fragment = document.createDocumentFragment();

    for (const item of this.items) {
      const { title, action } = item;
      const contextMenuItem = new ContextMenuItem(title, action);
      this.disposables.add(contextMenuItem);

      fragment.appendChild(contextMenuItem.el);
    }

    this._el.appendChild(fragment);
  }
}

export class EditorCustomContextMenu extends Disposable {
  private layer: ContextMenuLayer;

  constructor(private readonly context: EditorGlobalContext) {
    super();
  }

  public createMenu(position: IPosition, items: IContextMenuItem[]): void {
    const { display } = this.context;

    const { top, left } = display.toDOMPosition(position);
    const menu = new CustomContextMenubar(items);

    removeChildren(this.layer.el);

    this.layer.el.appendChild(menu.el);
    this.layer.top(top);
    this.layer.left(left);
  }

  public mount(body: HTMLElement): void {
    this.layer = new ContextMenuLayer();
    this.layer.mount(body);
  }
}
