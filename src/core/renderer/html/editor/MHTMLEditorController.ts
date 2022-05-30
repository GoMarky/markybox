import { MObject } from '@/core/objects/MObject';
import { MHTMLRenderer } from '@/core';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { splitAtIndex } from '@/core/app/common';
import * as dom from '@/base/dom';
import { BASE_INDENT_VALUE } from '@/core/renderer/html/common/helpers';
import { MEditorAutoSave } from '@/core/objects/MEditorAutoSave';

export class MHTMLEditorController extends MObject {
  public readonly editorAutoSave: MEditorAutoSave

  private _currentRow: MHTMLGlyphRow;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.editorAutoSave = new MEditorAutoSave(this.renderer)
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
    const rightParenRow = this.findClosestRightParenRowDown(index);
  }

  public isCurrentColumnInsideGlyph(): boolean {
    const { navigator } = this.renderer;
    const { currentRow } = this;
    const { column } = navigator.position;

    return currentRow.contains(column);
  }

  public addRowAt(index: number): MHTMLGlyphRow {
    const { storage } = this.renderer;
    const { textLayer } = this.renderer.display;

    const row = new MHTMLGlyphRow(this.renderer, index);
    storage.addRowAt(row, index);
    dom.insertChildAtIndex(textLayer.el, row.el, index);

    return row;
  }

  public addRow(text: string): MHTMLGlyphRow {
    const { renderer } = this;
    const { storage } = renderer;
    const { textLayer } = this.renderer.display;

    const row = new MHTMLGlyphRow(renderer, storage.count);
    row.setText(text);
    storage.addRow(row);

    textLayer.el.appendChild(row.el);

    return row;
  }

  public addEmptyRow(): MHTMLGlyphRow {
    const { renderer } = this;
    const { storage, display } = renderer;

    const row = new MHTMLGlyphRow(renderer, storage.count);
    this._currentRow = row;
    storage.addRow(row);
    display.textLayer.el.appendChild(row.el);

    return row;
  }

  public removeLastRow(): void {
    const { renderer } = this;
    const { storage } = renderer;

    const lastRow = storage.last();
    storage.removeRow(lastRow);
    this._currentRow = storage.last();
  }

  public removeRow(row: MHTMLGlyphRow): void {
    const { renderer } = this;
    const { storage } = renderer;

    storage.removeRow(row);
  }

  public setCurrentRow(row: MHTMLGlyphRow): MHTMLGlyphRow {
    this._currentRow = row;

    return row;
  }

  public setWholeText(text: string): void {
    const textParts = text.split(/\n/);

    for (const [index, rowText] of textParts.entries()) {
      const row = this.addRow(rowText);

      const isLastIteration = index === textParts.length - 1;

      if (isLastIteration) {
        this._currentRow = row;
      }
    }
  }

  public removeIndentFromCurrentRow(): void {
    const { currentRow } = this;
    const { navigator } = this.renderer;
    const { column } = navigator.position;

    currentRow.slice(column - 4, column);
    navigator.setPosition({ row: currentRow.index, column: column - 4 })
  }

  public addIndentToCurrentRow(): void {
    const { currentRow } = this;
    const { navigator } = this.renderer;
    const { column } = navigator.position;

    currentRow.inputAt(BASE_INDENT_VALUE, column);
    navigator.setPosition({ row: currentRow.index, column: column + 4 })
  }

  public findClosestLeftParenRowDown(startIndex: number): MHTMLGlyphRow | undefined {
    const { storage } = this.renderer;

    for (let i = startIndex + 1; i < storage.count; i++) {
      const row = storage.at(i);

      // Если во время поиска нашли правую скобку, значит следующая левая скобка уже не принадлежит искомой позиции
      if (row?.fragment.hasCloseBrace) {
        return undefined;
      }

      if (row?.fragment.hasOpenBrace) {
        return row;
      }
    }

    return undefined;
  }

  public findClosestRightParenRowDown(startIndex: number): MHTMLGlyphRow | undefined {
    const { storage } = this.renderer;

    for (let i = startIndex + 1; i < storage.count; i++) {
      const row = storage.at(i);

      // Если во время поиска нашли левую скобку, значит следующая правая скобка уже не принадлежит искомой позиции
      if (row?.fragment.hasOpenBrace) {
        return undefined;
      }

      if (row?.fragment.hasCloseBrace) {
        return row;
      }
    }

    return undefined;
  }

  public getRightParenAmountFromStartByIndex(startIndex: number): number {
    const { storage } = this.renderer;
    let amount = 0;

    for (let i = startIndex; i >= 0; i--) {
      const row = storage.at(i);

      if (row?.fragment.hasOpenBrace) {
        amount -= 1;
      }

      if (row?.fragment.hasCloseBrace) {
        amount += 1;
      }
    }

    return amount;
  }

  public getLeftParenAmountFromStartByIndex(startIndex: number): number {
    const { storage } = this.renderer;
    let amount = 0;

    for (let i = startIndex; i >= 0; i--) {
      const row = storage.at(i);

      if (row?.fragment.hasCloseBrace) {
        amount -= 1;
      }

      if (row?.fragment.hasOpenBrace) {
        amount += 1;
      }
    }

    return amount;
  }

  public clear(): void {
    this.renderer.storage.clear();
    this.addEmptyRow();
  }
}
