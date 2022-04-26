import { MObject } from '@/core/objects/MObject';
import { indexOutOfRange } from '@/base/array';
import { CriticalError } from '@/base/errors';
import { Emitter, IEvent } from '@/base/event';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';

export class MHTMLStorage extends MObject {
  private readonly _rows: MHTMLGlyphRow[] = [];

  constructor() {
    super();
  }

  public clear(): void {
    for (const row of this._rows) {
      this.removeRow(row);
    }

    this.last().dispose();
    this._rows.splice(0, this._rows.length - 1)
    this._update();
  }

  public addRow(row: MHTMLGlyphRow): void {
    this._rows.push(row);
    this._update();
  }

  public addRowAt(row: MHTMLGlyphRow, index: number): void {
    this._rows.splice(index, 0, row);
    this._update();
  }

  public removeRow(row: MHTMLGlyphRow): void {
    const index = this._rows.findIndex((r) => r === row);

    // Если удаляемая строчка первая и единственная - то не удаляем ее.
    if (this.count === 1 && index === 0) {
      return;
    }

    if (indexOutOfRange(index)) {
      throw new CriticalError(`Cant find row: ${row}`);
    }

    row.dispose();
    this._rows.splice(index, 1);

    this._update();
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
