import { MObject } from '@/core/objects/MObject';
import { MCaretLayer } from '@/core/renderer/html/layers/MCaretLayer';
import { Emitter, IEvent } from '@/base/event';
import { IPosition } from '@/core/app/common';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';
import { MHTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';

export class MHTMLEditorNavigator extends MObject {
  protected _currentPosition: IPosition = { row: 0, column: 0 };
  private readonly layer: MCaretLayer;

  constructor(
    protected readonly display: MHTMLDisplayRenderer,
    protected readonly storage: MHTMLStorage,
    public readonly name: string) {
    super();

    this.layer = new MCaretLayer(name);
  }

  public get position(): IPosition {
    return this._currentPosition;
  }

  public setPosition(position: IPosition): void {
    return this.doSetPosition(position);
  }

  public mount(root: HTMLElement): void {
    this.layer.mount(root);
  }

  public prevColumn() {
    const { row, column } = this._currentPosition;

    let newColumn = column - 1;

    if (newColumn < 0) {
      newColumn = 0;
    }

    const newPosition: IPosition = { row, column: newColumn };
    this.doSetPosition(newPosition);
  }

  public nextColumn() {
    const { row, column } = this._currentPosition;

    const newPosition: IPosition = { row, column: column + 1 };
    this.doSetPosition(newPosition);
  }

  public previousRow() {
    const { row, column } = this._currentPosition;

    const newPosition: IPosition = { row: row - 1, column }
    this.doSetPosition(newPosition);
  }

  public nextRow() {
    const { row, column } = this._currentPosition;

    const newPosition: IPosition = { row: row + 1, column }
    this.doSetPosition(newPosition);
  }

  protected doSetPosition(position: IPosition): void {
    const { layer, storage } = this;
    let { row, column } = position;

    if (row < 0) {
      row = 0;
    }

    if (column < 0) {
      column = 0;
    }

    const matchedRow = storage.at(row);

    if (!matchedRow) {
      return console.warn(`Can't set position on unknown row index - ${row}`)
    }

    if (matchedRow.empty()) {
      column = 0;
    } else if (column >= matchedRow.columnsCount) {
      column = matchedRow.columnsCount;
    }

    const normalizedPosition: IPosition = { row, column };
    const displayPosition = this.display.toDOMPosition(normalizedPosition);

    layer.setPosition(displayPosition);
    this._currentPosition = normalizedPosition;
  }
}

export class MHTMLEditorBodyNavigator extends MHTMLEditorNavigator {
  private readonly _onDidUpdatePosition: Emitter<IPosition> = new Emitter<IPosition>();
  public readonly onDidUpdatePosition: IEvent<IPosition> = this._onDidUpdatePosition.event;

  constructor(
    display: MHTMLDisplayRenderer,
    storage: MHTMLStorage,
    name: string
  ) {
    super(display, storage, name);
  }

  protected doSetPosition(position: IPosition): void {
    super.doSetPosition(position);

    this._onDidUpdatePosition.fire(this._currentPosition);
  }
}
