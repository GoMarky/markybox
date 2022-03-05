import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer, IRendererEditorController } from '@/core/renderer/renderer';
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
  private readonly _rows: MRow[] = [];
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

  public get rows(): MRow[] {
    return this._rows;
  }

  public get rowsCount(): number {
    return this._rows.length;
  }

  public setCurrentRow(row: MRow): MRow {
    this._currentRow = row;

    return row;
  }

  public getCurrentRow(): MRow {
    return this._currentRow;
  }

  public getRowByPosition(rowIndex: number): MRow | undefined {
    const row = this._rows[rowIndex];

    return row;
  }

  public addEmptyRow(): MRow {
    const { _rows, renderer } = this;
    const { el } = renderer.textLayer
    const row = new MRow(el, _rows.length);

    this._currentRow = row;

    _rows.push(row);
    renderer.onAddRow(row);

    return row;
  }
}
