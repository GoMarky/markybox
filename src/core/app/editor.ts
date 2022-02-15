import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer, IRendererEditorController } from '@/core/renderer/renderer';
import { MRow } from '@/core/objects/MRow';
import { ILogger } from '@/core/renderer/common';
import { ICodeFormatter } from '@/core/formatters/common';
import { JavascriptCodeFormatter } from '@/core/formatters/javascript/javascript-formatter';

export interface IEditorOptions {
  readonly renderer: IAbstractRenderer;
  readonly fullscreen: boolean;
  readonly logger?: ILogger;
}

export class MEditor extends MObject implements IRendererEditorController {
  private readonly renderer: IAbstractRenderer;
  private readonly rows: MRow[] = [];
  private _currentRow: MRow;
  private _currentFormatter: ICodeFormatter;

  public readonly logger: ILogger | undefined;

  constructor(options: IEditorOptions) {
    super();

    const { renderer, fullscreen, logger } = options;
    this.renderer = renderer;
    this.logger = logger;

    if (fullscreen) {
      this.renderer.display.setFullScreen();
    }

    this._currentFormatter = new JavascriptCodeFormatter();

    this.renderer.editor = this;
  }

  public get formatter(): ICodeFormatter {
    return this._currentFormatter;
  }

  public get rowsCount(): number {
    return this.rows.length;
  }

  public setCurrentRow(row: MRow): MRow {
    this._currentRow = row;

    return row;
  }

  public getRowByPosition(row: number): MRow {
    return this.rows[row];
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
}
