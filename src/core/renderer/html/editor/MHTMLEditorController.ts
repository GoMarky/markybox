import { MObject } from '@/core/objects/MObject';
import { MHTMLRenderer } from '@/core';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { splitAtIndex } from '@/core/app/common';
import * as dom from '@/base/dom';

export class MHTMLEditorController extends MObject {
  private _currentRow: MHTMLGlyphRow;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  public get currentRow(): MHTMLGlyphRow {
    return this._currentRow;
  }

  public get prevRow(): MHTMLGlyphRow | null {
    const { index } = this.currentRow;
    const { storage } = this.renderer;

    return storage.at(index - 1);
  }

  public get nextRow(): MHTMLGlyphRow | null {
    const { index } = this.currentRow;
    const { storage } = this.renderer;

    return storage.at(index + 1);
  }

  public splitCurrentRow(column: number): void {
    const { currentRow } = this;
    const { text } = currentRow;

    const [first, last] = splitAtIndex(column)(text);

    currentRow.setText(first);

    const nextRow = this.addRowAt(currentRow.index + 1);
    nextRow.setText(last);
  }

  public expandOrShrinkRow(index: number): void {
    const { renderer } = this;
    const { storage } = renderer;

    const leftParenRow = storage.at(index);
    const rightParenRow = this.findClosestRightParenRow(index);
  }

  public isCurrentColumnInsideGlyph(): boolean {
    const { navigator } = this.renderer;
    const { currentRow } = this;
    const { column } = navigator.position;

    return currentRow.contains(column);
  }

  public addRowAt(index: number): MHTMLGlyphRow {
    const { storage, textLayer } = this.renderer;
    const row = new MHTMLGlyphRow(this.renderer, index);
    storage.addRowAt(row, index);
    console.log(row.index);
    dom.insertChildAtIndex(textLayer.el, row.el, index);

    return row;
  }

  public addRow(text: string): MHTMLGlyphRow {
    const { renderer } = this;
    const { storage, textLayer } = renderer;
    const row = new MHTMLGlyphRow(renderer, storage.count);
    row.setText(text);
    storage.addRow(row);

    textLayer.el.appendChild(row.el);

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

  public removeLastRow(): void {
    const { renderer } = this;
    const { storage } = renderer;

    const lastRow = storage.last();
    storage.removeRow(lastRow);
    this._currentRow = storage.last();
  }

  public setCurrentRow(row: MHTMLGlyphRow): MHTMLGlyphRow {
    this._currentRow = row;

    return row;
  }

  public setWholeText(text: string): void {
    const textParts = text.split('\n').filter(Boolean);

    for (const [index, rowText] of textParts.entries()) {
      const row = this.addRow(rowText);

      if (index === textParts.length - 1) {
        this.setCurrentRow(row);
      }
    }
  }

  private findClosestRightParenRow(startIndex: number): MHTMLGlyphRow | undefined {
    const { storage } = this.renderer;

    for (let i = startIndex + 1; i < storage.count; i++) {
      const row = storage.at(i);

      if (row?.fragment.hasRightParen) {
        return row;
      }
    }

    return undefined;
  }
}
