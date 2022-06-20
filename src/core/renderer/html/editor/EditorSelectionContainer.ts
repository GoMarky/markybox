import { BaseObject } from '@/core/objects/BaseObject';
import { IPosition } from '@/core/app/common';
import { UserSelectionLayer } from '@/core/renderer/html/layers/UserSelectionLayer';
import { HTMLRenderer } from '@/core';
import { EditorDisplayController } from '@/core/renderer/html/system/EditorDisplayController';
import { EditorStorage } from '@/core/renderer/html/system/EditorStorage';
import { toDisposable } from '@/platform/lifecycle/common/lifecycle';

export interface ISelectionPosition {
  row: number;
  startColumn: number;
  endColumn: number;
}

const endl = '\n';

export class EditorSelectionContainer extends BaseObject {
  private readonly layer: UserSelectionLayer;

  public started = false;
  public startPosition: IPosition | null;
  public lastPosition: IPosition | null;
  private _positions: ISelectionPosition[] = [];

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

  public getSelectedText(): string {
    const { rows } = this.storage;

    return rows
      .filter((row) => this._positions.find((position) => position.row === row.index))
      .map((row) => row.toString()).join(endl);
  }

  public selectAll(): void {
    const { rows } = this.storage;

    for (const row of rows) {
      this._positions.push({ row: row.index, startColumn: 0, endColumn: 0 })
    }

    this.layer.addSelectionRows(this._positions);
  }

  public updateSelection(position: { start: IPosition, end: IPosition }): void {
    const { storage } = this;
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
      positions.push({ row: i, startColumn, endColumn });
    }

    this._positions = positions;
    this.layer.addSelectionRows(positions);
  }

  public clearSelect(): void {
    this.layer.clear();
  }

  public mount(body: HTMLElement): void {
    this.layer.mount(body);

    const onContextmenu = (event: Event) => event.preventDefault();
    const onMousedown = (event: MouseEvent) => this.renderer.currentState.onSelectionStart(event);
    const onMousemove = (event: MouseEvent) => this.renderer.currentState.onSelectionMove(event);
    const onMouseup = (event: MouseEvent) => this.renderer.currentState.onSelectionEnd(event);

    body.addEventListener('contextmenu', onContextmenu);
    window.addEventListener('mousedown', onMousedown);
    window.addEventListener('mousemove', onMousemove);
    window.addEventListener('mouseup', onMouseup);

    this.disposables.add(toDisposable(() => body.removeEventListener('contextmenu', onContextmenu)));
    this.disposables.add(toDisposable(() => window.removeEventListener('mousedown', onMousedown)));
    this.disposables.add(toDisposable(() => window.removeEventListener('mousemove', onMousemove)));
    this.disposables.add(toDisposable(() => window.removeEventListener('mouseup', onMouseup)));
  }
}
