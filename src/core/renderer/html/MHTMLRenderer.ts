import { MObject } from '@/core/objects/MObject';
import { DisposableStore } from '@/platform/lifecycle/common/lifecycle';
import { IAbstractRenderer } from '@/core/renderer/renderer';
import { MRow } from '@/core/objects/MRow';
import { toPixel } from '@/base/dom';
import { MEditorGutter } from '@/core/renderer/html/MEditorGutter';
import { MEditorBody } from '@/core/renderer/html/MEditorBody';
import { MEditor } from '@/core';

export interface IDisplayRenderer {
  setFullScreen(): void;
}

class HTMLDisplayRenderer extends MObject implements IDisplayRenderer {
  constructor(private readonly root: HTMLElement) {
    super();
  }

  public setFullScreen(): void {
    const { innerWidth, innerHeight } = window;

    this.root.style.width = toPixel(innerWidth);
    this.root.style.height = toPixel(innerHeight);
  }
}

export class MHTMLRenderer extends MObject implements IAbstractRenderer {
  private readonly disposables: DisposableStore = new DisposableStore();

  public readonly editor: MEditor;
  public readonly display: IDisplayRenderer;
  public readonly gutter: MEditorGutter;
  public readonly body: MEditorBody;

  constructor(private readonly root: HTMLElement) {
    super();

    this.display = new HTMLDisplayRenderer(root);
    this.gutter = new MEditorGutter(root);
    this.body = new MEditorBody(root);
  }

  public render() {
    const { root } = this;
  }

  public init(): void {
    this.body.el.addEventListener('click', (event) => {
      const { rows } = this.editor;

      const rect = this.body.el.getBoundingClientRect();
      const y = event.clientY - rect.top;
      const totalLength = rows.length / 19;
      const res = totalLength - y;

      const position = Math.abs(Math.ceil(res / 19));

      const row = rows[position];

      if (row) {
        console.log(row);
      }
    })
  }
}
