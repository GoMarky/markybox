import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/renderer/common';
import { MSelectionLayer } from '@/core/renderer/html/layers/MSelectionLayer';

export interface ISelectionPosition {
  start: IPosition;
  end: IPosition;
}

export class MHTMLEditorSelection extends MObject {
  private _currentPosition: ISelectionPosition;
  private readonly layer: MSelectionLayer;

  constructor() {
    super();

    this.layer = new MSelectionLayer();
  }

  public get position(): ISelectionPosition {
    return this._currentPosition;
  }

  public setPosition(position: ISelectionPosition): void {
    console.log(position);
  }
}
