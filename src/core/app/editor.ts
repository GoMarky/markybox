import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer, IRendererEditorController } from '@/core/renderer/renderer';
import { MRow } from '@/core/objects/MRow';

export interface IEditorOptions {
  readonly renderer: IAbstractRenderer;
  readonly fullscreen: boolean;
}

export class MEditor extends MObject implements IRendererEditorController {
  private readonly renderer: IAbstractRenderer;
  private readonly rows: MRow[] = [];

  private _currentRow: MRow;

  constructor(options: IEditorOptions) {
    super();

    const { renderer, fullscreen } = options;
    this.renderer = renderer;

    if (fullscreen) {
      this.renderer.display.setFullScreen();
    }

    this.renderer.editor = this;
  }

  public setCurrentRow(row: MRow): MRow {
    this._currentRow = row;

    return row;
  }

  public getCurrentRow(): MRow {
    return this._currentRow;
  }

  public addEmptyRow(): MRow {
    const { rows, renderer } = this;
    const { el } = renderer.textLayer
    const row = new MRow(el, rows.length);

    this._currentRow = row;

    rows.push(row);
    renderer.onAddRow(row);

    return row;
  }

  public addRowWithContent(content: string): this {
    console.log(content);

    return this;
  }
}
