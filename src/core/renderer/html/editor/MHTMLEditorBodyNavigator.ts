import { MHTMLRenderer } from '@/core';
import { MObject } from '@/core/objects/MObject';
import { MCaretLayer } from '@/core/renderer/html/layers/MCaretLayer';
import { Emitter, IEvent } from '@/base/event';
import { IPosition } from '@/core/app/common';

export class MHTMLEditorBodyNavigator extends MObject {
  private _currentPosition: IPosition = { row: 0, column: 0 };
  private layer: MCaretLayer;
  private name: string;

  private readonly _onDidUpdatePosition: Emitter<IPosition> = new Emitter<IPosition>();
  public readonly onDidUpdatePosition: IEvent<IPosition> = this._onDidUpdatePosition.event;

  constructor(private readonly renderer: MHTMLRenderer, name: string) {
    super();

    this.name = name;
    this.layer = new MCaretLayer(renderer, name);
  }

  public get position(): IPosition {
    return this._currentPosition;
  }

  public setPosition(position: IPosition) {
    return this.doSetPosition(position);
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

  private doSetPosition(position: IPosition): void {
    const { layer, renderer } = this;
    const { storage } = renderer;
    let { row, column } = position;

    if (row < 0) {
      row = 0;
    }

    if (column < 0) {
      column = 0;
    }

    const matchedRow = storage.at(row);

    if (matchedRow) {
      if (matchedRow.empty()) {
        column = 0;
      } else {
        column = matchedRow.columnsCount;
      }
    }

    const normalizedPosition: IPosition = { row, column };

    layer.setPosition(normalizedPosition);
    this._currentPosition = normalizedPosition;

    this._onDidUpdatePosition.fire(normalizedPosition);
  }
}
