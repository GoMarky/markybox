import { BaseObject } from '@/core/objects/BaseObject';
import { IPosition } from '@/core/app/common';
import { UserSelectionLayer } from '@/core/renderer/html/layers/UserSelectionLayer';
import { HTMLRenderer } from '@/core';
import { EditorDisplayController } from '@/core/renderer/html/system/EditorDisplayController';
import { EditorStorage } from '@/core/renderer/html/system/EditorStorage';
import { toDisposable } from '@/platform/lifecycle/common/lifecycle';
import { debounce } from '@/base/async';
import { getLastElement } from '@/base/array';
import { CriticalError } from '@/base/errors';
import { GlyphDOMNode } from '@/core/renderer/html/glyphs/GlyphDOMNode';
import { GlyphRowElement } from '@/core/renderer/html/common/GlyphRowElement';

export interface ISelectionPosition {
  row: number;
  startColumn: number;
  endColumn: number;
}

const endl = '\n';

export class EditorSelectionContainer extends BaseObject {
  private readonly layer: UserSelectionLayer;
  private _positions: ISelectionPosition[] = [];

  public started = false;
  public startPosition: IPosition | null;
  public lastPosition: IPosition | null;

  public get positions(): ISelectionPosition[] {
    return this._positions;
  }

  constructor(
    private readonly renderer: HTMLRenderer,
    private readonly storage: EditorStorage,
    private readonly display: EditorDisplayController
  ) {
    super();

    this.layer = new UserSelectionLayer(display);
  }

  private render(): void {
    this.layer.addSelectionRows(this._positions);
  }

  public getSelectedText(): string {
    const { rows } = this.storage;

    return rows
      .filter((row) => this._positions.find((position) => position.row === row.index))
      .map((row) => row.toString()).join(endl);
  }

  public selectRow(row: GlyphRowElement): void {
    const { fragment } = row;

    const first = fragment.first();
    const last = fragment.last();

    if (!first || !last) {
      throw new CriticalError('Expect first or last glyph in fragment to be defined');
    }

    const startColumn = first.start;
    const endColumn = last.end;

    const position: ISelectionPosition = { row: row.index, startColumn, endColumn };

    this._positions = [position];
    this.render();
  }

  public selectGlyph(row: GlyphRowElement, glyph: GlyphDOMNode): void {
    const { start, end } = glyph;

    const position: ISelectionPosition = { row: row.index, startColumn: start, endColumn: end };

    this._positions = [position];
    this.render();
  }

  public selectAll(): void {
    const { rows } = this.storage;

    this._positions = rows.map((row) => ({ row: row.index, startColumn: 0, endColumn: 0 }))

    this.render();
  }

  public updateSelection = debounce((position: { start: IPosition, end: IPosition }) => {
    const { storage } = this;
    const { start, end } = position;

    const isNotMoved = start.row === end.row && start.column === end.column;

    if (isNotMoved) {
      return;
    }

    const startRow = Math.abs(start.row < end.row ? start.row : end.row);
    let endRow = Math.abs(start.row > end.row ? start.row : end.row);

    if (endRow > storage.count) {
      endRow = storage.count;
    }

    const startColumn: number = Math.abs(start.column < end.column ? start.column : end.column);
    const endColumn: number = Math.abs(end.column > start.column ? end.column : start.column);

    const positions: ISelectionPosition[] = [];
    const isSingleRowSelection = startRow === endRow;

    // Если выделение идет в рамках одной и той же строки.
    if (isSingleRowSelection) {
      positions.push({ row: startRow, startColumn, endColumn });
    } else {
      // Если идет мультивыделение строк
      for (let i = startRow; i <= endRow - 1; i++) {
        positions.push({ row: i, startColumn, endColumn });
      }
    }

    const lastRowPosition = getLastElement(positions);

    if (lastRowPosition) {
      const { endColumn: lastRowEndColumnPosition, row } = lastRowPosition;
      const matchedRow = storage.at(row);

      if (!matchedRow) {
        throw new CriticalError('updateSelection# - expect row to be defined');
      }

      const { length: rowLength } = matchedRow;
      // Количество выделенных колонок в последней строке, не должно превышать количество
      // символов в строке
      if (lastRowEndColumnPosition > rowLength) {
        lastRowPosition.endColumn = rowLength;
      }
    }

    this._positions = positions;
    this.render();
  }, 5)

  public clearSelect(): void {
    this.layer.clear();
  }

  public mount(body: HTMLElement): void {
    this.layer.mount(body);

    const onContextmenu = (event: Event) => event.preventDefault();
    const onMousedown = (event: MouseEvent) => this.renderer.currentState.onSelectionStart(event);
    const onMousemove = (event: MouseEvent) => this.renderer.currentState.onSelectionMove(event);
    const onMouseup = (event: MouseEvent) => this.renderer.currentState.onSelectionEnd(event);
    const onDoubleClick = (event: MouseEvent) => this.renderer.currentState.onDoubleClick(event);

    body.addEventListener('contextmenu', onContextmenu);
    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mousemove', onMousemove);
    window.addEventListener('mouseup', onMouseup);
    window.addEventListener('dblclick', onDoubleClick);

    this.disposables.add(toDisposable(() => body.removeEventListener('contextmenu', onContextmenu)));
    this.disposables.add(toDisposable(() => window.removeEventListener('mousedown', onMousedown)));
    this.disposables.add(toDisposable(() => window.removeEventListener('mousemove', onMousemove)));
    this.disposables.add(toDisposable(() => window.removeEventListener('mouseup', onMouseup)));
  }
}
