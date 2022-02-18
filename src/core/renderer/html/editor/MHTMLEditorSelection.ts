import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/renderer/common';
import { MSelectionLayer } from '@/core/renderer/html/layers/MSelectionLayer';
import { MHTMLRenderer } from '@/core';

export interface ISelectionPosition {
  start: IPosition;
  end: IPosition;
}

export class MHTMLEditorSelection extends MObject {
  private _currentPosition: ISelectionPosition;
  private readonly layer: MSelectionLayer;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.layer = new MSelectionLayer();
  }

  public get position(): ISelectionPosition {
    return this._currentPosition;
  }

  public selectAll(): void {
    const { rows } = this.renderer.editor;

    console.log(rows);
  }

  public setPosition(position: ISelectionPosition): void {
    console.log(position);
  }
}
