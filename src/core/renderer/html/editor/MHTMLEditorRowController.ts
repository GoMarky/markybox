import { MObject } from '@/core/objects/MObject';
import { MHTMLRenderer } from '@/core';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { splitAtIndex } from '@/core/app/common';

export class MHTMLEditorRowController extends MObject {
  private _currentRow: MHTMLGlyphRow;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  public get currentRow(): MHTMLGlyphRow {
    return this._currentRow;
  }

  public splitCurrentRow(column: number): void {
    const { currentRow } = this;
    const { text } = currentRow;

    const [first, last] = splitAtIndex(column)(text);

    currentRow.setText(first);

    const nextRow = this.addRowAt(currentRow.index + 1);
    nextRow.setText(last);
  }

  public isCurrentColumnInsideGlyph(): boolean {
    const { navigator } = this.renderer;
    const { currentRow } = this;
    const { column } = navigator.position;

    return currentRow.contains(column);
  }

  public addRowAt(index: number): MHTMLGlyphRow {
    const { renderer } = this;
    const { storage } = renderer;
    const row = new MHTMLGlyphRow(renderer, index);
    this._currentRow = row;
    storage.addRowAt(row, index);

    renderer.textLayer.el.appendChild(row.el);

    return row;
  }

  public addEmptyRow(): MHTMLGlyphRow {
    const { renderer } = this;
    const { storage } = renderer;
    const row = new MHTMLGlyphRow(renderer, storage.count);
    this._currentRow = row;
    storage.addRow(row);

    renderer.textLayer.el.appendChild(row.el);

    return row;
  }

  public setCurrentRow(row: MHTMLGlyphRow): MHTMLGlyphRow {
    this._currentRow = row;

    return row;
  }
}
