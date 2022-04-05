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

  public addRowAt(row: MHTMLGlyphRow, index: number): void {
    this._rows.splice(index, 0, row);
    this._onDidAddRow.fire(row);
  }

  public removeRow(row: MHTMLGlyphRow): void {
    const index = this._rows.findIndex((r) => r === row);

    // Если удаляемая строчка последняя - то не удаляем ее.
    if (index === 0) {
      return;
    }

    if (indexOutOfRange(index)) {
      throw new CriticalError(`Cant find row: ${row}`);
    }

    this._rows.splice(index, 1);

    row.dispose();
    this._onDidRemoveRow.fire(row);
  }

  public last(): MHTMLGlyphRow {
    return this._rows[this.count - 1];
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
