import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/renderer/common';
import { MSelectionLayer } from '@/core/renderer/html/layers/MSelectionLayer';
import { MHTMLRenderer } from '@/core';
import { MRow } from '@/core/objects/MRow';

export interface ISelectionPosition {
  start: IPosition;
  end: IPosition;
}

const endl = '\n';

export class MHTMLEditorSelection extends MObject {
  private _currentPosition: ISelectionPosition;
  private readonly layer: MSelectionLayer;

  private _started = false;
  private startX = 0;
  private startY = 0;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.layer = new MSelectionLayer();

    this.init();
  }

  public get position(): ISelectionPosition {
    return this._currentPosition;
  }

  public getSelectedText(): string {
    // TODO: select rows
    const { rows } = this.renderer.editor;

    const text = rows.map((row) => MHTMLEditorSelection.rowToText(row)).join(endl);

    return text;
  }

  public selectAll(): void {
    const { rows } = this.renderer.editor;

    console.log(rows);
  }

  public setPosition(position: ISelectionPosition): void {
    console.log(position);
  }

  private static rowToText(row: MRow): string {
    return row.content.text;
  }

  private onSelectionStart(event: MouseEvent): void {
    this._started = true;

    const { clientX, clientY } = event;

    this.startX = clientX;
    this.startY = clientY;
  }

  private onSelectionMove(event: MouseEvent): void {
    if (!this._started) {
      return;
    }

    const { clientX, clientY } = event;
  }

  private onSelectionEnd(_: MouseEvent): void {
    this._started = false;

    this.startX = 0;
    this.startY = 0;
  }

  private init(): void {
    window.addEventListener('mousedown', this.onSelectionStart.bind(this));
    window.addEventListener('mousemove', this.onSelectionMove.bind(this));
    window.addEventListener('mouseup', this.onSelectionEnd.bind(this));
  }
}
