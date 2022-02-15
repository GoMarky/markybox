import { MHTMLRenderer } from '@/core';
import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/renderer/common';

export class MHTMLEditorBodyNavigator extends MObject {
  private _currentPosition: IPosition;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.init();
  }

  public get position(): IPosition {
    return this._currentPosition;
  }

  public setPosition(position: IPosition) {
    const { caretLayer } = this.renderer;

    caretLayer.setPosition(position);
    this._currentPosition = position;
  }

  private init(): void {
    this._currentPosition = { row: 0, column: 0 };
  }
}
