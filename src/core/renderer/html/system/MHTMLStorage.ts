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
    this._update();
    this._onDidAddRow.fire(row);
  }

  public addRowAt(row: MHTMLGlyphRow, index: number): void {
    this._rows.splice(index, 0, row);
    this._update();
    this._onDidAddRow.fire(row);
  }

  public removeRow(row: MHTMLGlyphRow): void {
    const index = this._rows.findIndex((r) => r === row);

    // Если удаляемая строчка первая - то не удаляем ее.
    if (index === 0) {
      return;
    }

    if (indexOutOfRange(index)) {
      throw new CriticalError(`Cant find row: ${row}`);
    }

    this._rows.splice(index, 1);

    row.dispose();
    this._update();

    this._onDidRemoveRow.fire(row);
  }

  public last(): MHTMLGlyphRow {
    return this._rows[this.count - 1];
  }

  public has(index: number): boolean {
    return Boolean(this._rows[index]);
  }

  public at(index: number): MHTMLGlyphRow | null {
    if (this.has(index)) {
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

  private _update(): void {
    for (const [index, row] of this._rows.entries()) {
      row.setIndex(index);
    }
  }
}
