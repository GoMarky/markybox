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
  private readonly rows: MRow[] = [];

  constructor(options: IEditorOptions) {
    super();

    const { renderer, fullscreen } = options;

    this.renderer = renderer;

    if (fullscreen) {
      this.renderer.display.setFullScreen();
    }

    this.renderer.gutter.init();
  }

  public addRow(): this {
    const { rows } = this;
    const row = new MRow(rows.length);

    rows.push(row);
    this.renderer.gutter.renderRows(rows);

    return this;
  }
}
