import { MRow } from '@/core/objects/MRow';

export interface IDOMElement {
  readonly el: HTMLElement;
}

export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IRendererEditorController {
  addEmptyRow(): void;

  setCurrentRow(row: MRow): void;

  getCurrentRow(): MRow;
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

  editor: IRendererEditorController;

  onAddRow(row: MRow): void;

  onRemoveRow(row: MRow): void;
}
