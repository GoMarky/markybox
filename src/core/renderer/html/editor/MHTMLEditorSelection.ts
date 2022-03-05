import { MObject } from '@/core/objects/MObject';
import { IPosition } from '@/core/renderer/common';
import { MSelectionLayer } from '@/core/renderer/html/layers/MSelectionLayer';
import { MHTMLRenderer } from '@/core';
import { MRow } from '@/core/objects/MGlyphRow';

export interface ISelectionPosition {
  start: IPosition;
  end: IPosition;
}

const endl = '\n';

export class MHTMLEditorSelection extends MObject {
  private _currentPosition: ISelectionPosition;
  private readonly layer: MSelectionLayer;

  private _started = false;
  private startPosition: IPosition | null;
  private lastPosition: IPosition | null;

  constructor(private readonly renderer: MHTMLRenderer) {
    super();

    this.layer = new MSelectionLayer(renderer);

    this.init();
  }

  public get position(): ISelectionPosition {
    return this._currentPosition;
  }

  public getSelectedText(): string {
    // TODO: select rows
    const { rows } = this.renderer.editor;

    return rows.map((row) => MHTMLEditorSelection.rowToText(row)).join(endl);
  }

  public selectAll(): void {
    const { rows } = this.renderer.editor;

    console.log(rows);
  }

  public setPosition(position: ISelectionPosition): void {
    this._currentPosition = position;
    const { start, end } = position;

    // this.layer.addSelectionRow(end);
  }

  private static rowToText(row: MRow): string {
    return row.content.text;
  }

  private onSelectionStart(event: MouseEvent): void {
    this._started = true;

    const { clientX, clientY } = event;

    if (this.startPosition) {
      this.lastPosition = null;
    }

    this.startPosition = this.renderer.toEditorPosition({ left: clientX, top: clientY });
  }

  private onSelectionMove(event: MouseEvent): void {
    if (!this._started) {
      return;
    }

    const { clientX, clientY } = event;

    this.lastPosition = this.renderer.toEditorPosition({ left: clientX, top: clientY });

    this.setPosition({ start: this.startPosition as IPosition, end: this.lastPosition });
  }

  private onSelectionEnd(_: MouseEvent): void {
    this._started = false;
  }

  private init(): void {
    window.addEventListener('mousedown', this.onSelectionStart.bind(this));
    window.addEventListener('mousemove', this.onSelectionMove.bind(this));
    window.addEventListener('mouseup', this.onSelectionEnd.bind(this));
  }
}
