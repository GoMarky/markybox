import { MHTMLRenderer } from '@/core';
import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/renderer/common';
import { MCaretLayer } from '@/core/renderer/html/layers/MCaretLayer';

export class MHTMLEditorBodyNavigator extends MObject {
  private _currentPosition: IPosition;
  private layer: MCaretLayer;
  private name: string;

  constructor(private readonly renderer: MHTMLRenderer, name: string) {
    super();

    this.name = name;
    this.layer = new MCaretLayer(this.renderer);
    this.init();
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
    const { layer } = this;

    layer.setPosition(position);
    this._currentPosition = position;
  }

  private init(): void {
    this._currentPosition = { row: 0, column: 0 };
  }
}
