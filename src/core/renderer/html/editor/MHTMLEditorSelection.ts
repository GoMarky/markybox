import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/app/common';
import { MSelectionLayer } from '@/core/renderer/html/layers/MSelectionLayer';
import { MHTMLRenderer } from '@/core';

export interface ISelectionPosition {
  row: number;
  startColumn: number;
  endColumn: number;
}

const endl = '\n';

export class MHTMLEditorSelection extends MObject {
  private readonly layer: MSelectionLayer;

  public started = false;
  public startPosition: IPosition | null;
  public lastPosition: IPosition | null;
  private _positions: ISelectionPosition[] = [];

  public get positions(): ISelectionPosition[] {
    return this._positions;
  }

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.layer = new MSelectionLayer(renderer);

    this.init();
  }

  public getSelectedText(): string {
    const { rows } = this.renderer.storage;

    return rows
      .filter((row) => this._positions.find((position) => position.row === row.index))
      .map((row) => row.toString()).join(endl);
  }

  public selectAll(): void {
    const { rows } = this.renderer.storage;

    for (const row of rows) {
      this._positions.push({ row: row.index, startColumn: 0, endColumn: 0 })
    }

    this.layer.addSelectionRows(this._positions);
  }

  public updateSelection(position: { start: IPosition, end: IPosition }): void {
    const { storage } = this.renderer;
    const { start, end } = position;

    const isNotMoved = start.row === end.row && start.column === end.column;

    if (isNotMoved) {
      return;
    }

    const startRow = start.row <= end.row ? start.row : end.row;
    let endRow = start.row >= end.row ? start.row : end.row;

    if (endRow > storage.count) {
      endRow = storage.count;
    }

    const startColumn: number = start.column < end.column ? start.column : end.column;
    const endColumn: number = end.column > start.column ? end.column : start.column;

    const positions: ISelectionPosition[] = [];

    for (let i = startRow; i <= endRow - 1; i++) {
      const _startColumn = startColumn;
      const _endColumn = endColumn;

      positions.push({ row: i, startColumn: _startColumn, endColumn: _endColumn });
    }

    this._positions = positions;

    this.layer.addSelectionRows(positions);
  }

  public clearSelect(): void {
    this.layer.clear();
  }

  private init(): void {
    window.addEventListener('mousedown', (event) => this.renderer.currentState.onSelectionStart(event));
    window.addEventListener('mousemove', (event) => this.renderer.currentState.onSelectionMove(event));
    window.addEventListener('mouseup', (event) => this.renderer.currentState.onSelectionEnd(event));
  }
}
