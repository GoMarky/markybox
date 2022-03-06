import { MObject } from '@/core/objects/MObject';
import { indexOutOfRange } from '@/base/array';
import { CriticalError } from '@/base/errors';
import { Emitter, IEvent } from '@/base/event';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';

export class MHTMLStorage extends MObject {
  private readonly _rows: MHTMLGlyphRow[] = [];

  private readonly _onDidAddRow: Emitter<MHTMLGlyphRow> = new Emitter<MHTMLGlyphRow>();
  public readonly onDidAddRow: IEvent<MHTMLGlyphRow> = this._onDidAddRow.event;

  private readonly _onDidRemoveRow: Emitter<MHTMLGlyphRow> = new Emitter<MHTMLGlyphRow>();
  public readonly onDidRemoveRow: IEvent<MHTMLGlyphRow> = this._onDidRemoveRow.event;

  constructor() {
    super();
  }

  public addRow(row: MHTMLGlyphRow): void {
    this._rows.push(row);

    this._onDidAddRow.fire(row);
  }

  public removeRow(row: MHTMLGlyphRow): void {
    const index = this._rows.findIndex((r) => r === row);

    if (indexOutOfRange(index)) {
      throw new CriticalError(`Cant find row: ${row}`);
    }

    this._rows.splice(index, 1);

    this._onDidRemoveRow.fire(row);
  }

  public at(index: number): MHTMLGlyphRow | null {
    if (this._rows[index]) {
      return this._rows[index];
    }

    return null;
  }

  public get rows(): MHTMLGlyphRow[] {
    return this._rows;
  }

  public get count(): number {
    return this._rows.length;
  }
}
