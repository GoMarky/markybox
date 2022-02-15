import { MRow } from '@/core/objects/MRow';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { ILogger } from '@/core/renderer/common';

export interface IDOMElement {
  readonly el: HTMLElement;
}

export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IRendererEditorController {
  readonly rowsCount: number;

  readonly logger?: ILogger;

  addEmptyRow(): MRow;

  setCurrentRow(row: MRow): MRow;

  getCurrentRow(): MRow;

  getRowByPosition(row: number): MRow;
}

export interface IRendererGutter extends IDOMElement {
  onAddRow(row: MRow): void;
}

export interface IRendererBody extends IDOMElement {
  removeLastLetterFromCurrentRow(): void;
}

export interface IAbstractRenderer {
  readonly display: IRendererDisplay;
  readonly gutter: IRendererGutter;
  readonly body: IRendererBody;

  textLayer: MTextLayer;
  editor: IRendererEditorController;

  onAddRow(row: MRow): void;

  onRemoveRow(row: MRow): void;
}
