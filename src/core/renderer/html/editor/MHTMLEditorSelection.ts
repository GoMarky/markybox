import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/app/common';
import { MSelectionLayer } from '@/core/renderer/html/layers/MSelectionLayer';
import { MHTMLRenderer } from '@/core';

export interface ISelectionPosition {
  start: IPosition;
  end: IPosition;
}

const endl = '\n';

export class MHTMLEditorSelection extends MObject {
  private _currentPosition: ISelectionPosition;
  private readonly layer: MSelectionLayer;

  public started = false;
  public startPosition: IPosition | null;
  public lastPosition: IPosition | null;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.layer = new MSelectionLayer(renderer);

    this.init();
  }

  public get position(): ISelectionPosition {
    return this._currentPosition;
  }

  public getSelectedText(): string {
    const { rows } = this.renderer.storage;

    return rows.map((row) => row.toString()).join(endl);
  }

  public selectAll(): void {
    const { rows } = this.renderer.storage;
  }

  public setPosition(position: ISelectionPosition): void {
    this._currentPosition = position;
    const { start, end } = position;

    this.layer.addSelectionRow(end);
  }

  private init(): void {
    window.addEventListener('mousedown', (event) => this.renderer.currentState.onSelectionStart(event));
    window.addEventListener('mousemove', (event) => this.renderer.currentState.onSelectionMove(event));
    window.addEventListener('mouseup', (event) => this.renderer.currentState.onSelectionEnd(event));
  }
}
