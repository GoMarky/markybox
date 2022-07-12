import { BaseObject } from '@/core/objects/BaseObject';
import { toPixel } from '@/base/dom';
import { IPosition } from '@/core/app/common';
import { IDOMPosition } from '@/core/renderer/html/common/helpers';
import { IRendererDisplay } from '@/core/app/renderer';
import { debounce } from '@/base/async';
import { EditorGutterContainer } from '@/core/renderer/html/editor/EditorGutterContainer';
import { EditorStorage } from '@/core/renderer/html/system/EditorStorage';
import { toDisposable } from '@/platform/lifecycle/common/lifecycle';

const EDITOR_OFFSET_POSITION: IDOMPosition = {
  top: 46,
  left: 42,
}

export class EditorDisplayController extends BaseObject implements IRendererDisplay {
  private root: HTMLElement;
  public readonly gutter: EditorGutterContainer;

  constructor(private readonly storage: EditorStorage) {
    super();
    this.gutter = new EditorGutterContainer();
  }

  public toDOMPosition(position: IPosition): IDOMPosition {
    const { row, column } = position;

    return {
      top: row * 16,
      left: column * 7.2,
    }
  }

  public toEditorPosition(position: IDOMPosition): IPosition {
    let { top, left } = position;

    top += document.documentElement.scrollTop - EDITOR_OFFSET_POSITION.top;
    left -= EDITOR_OFFSET_POSITION.left;

    return {
      row: Math.round(top / 16),
      column: Math.round(left / 7.2),
    }
  }

  public setFullScreen(): void {
    const { innerWidth, innerHeight } = window;
    const { root } = this;

    root.style.width = toPixel(innerWidth);
    root.style.height = toPixel(innerHeight);
  }

  public mount(root: HTMLElement): void {
    this.root = root;
    this.gutter.mount(root);

    this.registerListeners();
  }

  private registerListeners(): void {
    const { storage, root } = this;
    const resizeBodyDelayMilliseconds = 250;

    const onResize = () => {
      const { innerWidth } = window;
      root.style.width = toPixel(innerWidth);
    };

    window.addEventListener('resize', onResize)

    const debounced = debounce(() => {
      const { count } = storage;
      const { innerHeight } = window;

      const totalRowsHeight = count * 16;
      const rootHeight = totalRowsHeight > innerHeight ? totalRowsHeight : innerHeight;

      root.style.height = toPixel(rootHeight);
    }, resizeBodyDelayMilliseconds);

    this.disposables.add(toDisposable(() => window.removeEventListener('resize', onResize)))
    this.disposables.add(storage.onDidUpdate(debounced));
  }
}
