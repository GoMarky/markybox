import { MRow } from '@/core/objects/MGlyphRow';
import { MTextLayer } from '@/core/renderer/html/layers/MTextLayer';
import { ILogger } from '@/core/renderer/common';
import { ICodeFormatter } from '@/core/formatters/common';

export interface IDOMElement {
  readonly el: HTMLElement;
}

export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IRendererEditorController {
  readonly rowsCount: number;
  readonly logger?: ILogger;
  readonly formatter: ICodeFormatter;

  addEmptyRow(): MRow;

  setCurrentRow(row: MRow): MRow;

  getCurrentRow(): MRow;

  getRowByPosition(rowIndex: number): MRow | undefined;
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
}
