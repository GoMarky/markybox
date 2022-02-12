import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer, IRendererDisplay } from '@/core/renderer/renderer';
import { toPixel } from '@/base/dom';
import { MEditorGutter } from '@/core/renderer/html/MEditorGutter';
import { MEditorBody } from '@/core/renderer/html/MEditorBody';

class HTMLDisplayRenderer extends MObject implements IRendererDisplay {
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
  public readonly display: IRendererDisplay;
  public readonly gutter: MEditorGutter;
  public readonly body: MEditorBody;

  constructor(private readonly root: HTMLElement) {
    super();

    this.display = new HTMLDisplayRenderer(root);
    this.gutter = new MEditorGutter(root);
    this.body = new MEditorBody(root);
  }
}
