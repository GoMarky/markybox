import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer } from '@/core/renderer/renderer';
import { MRow } from '@/core/objects/MRow';

export interface IPosition {
  row: number;
  column: number;
}

export interface IEditorOptions {
  readonly renderer: IAbstractRenderer;
  readonly fullscreen: boolean;
}

export class MEditor extends MObject {
  private readonly renderer: IAbstractRenderer;
  private readonly _rows: MRow[] = [];

  constructor(options: IEditorOptions) {
    super();

    const { renderer, fullscreen } = options;
    this.renderer = renderer;
    this.renderer.editor = this;

    if (fullscreen) {
      this.renderer.display.setFullScreen();
    }

    this.renderer.gutter.init();
    this.renderer.body.init();
    this.renderer.init();
  }

  public get rows(): MRow[] {
    return this._rows;
  }

  public addRow(): this {
    const { _rows } = this;
    const row = new MRow(_rows.length);

    _rows.push(row);
    this.renderer.gutter.renderRows(_rows);

    return this;
  }
}
