import { MRow } from '@/core/objects/MRow';

export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IRendererEditorController {
  setCurrentRow(row: MRow): void;

  getCurrentRow(): MRow;
}

export interface IRendererGutter {
  readonly el: HTMLElement;

  addRow(row: MRow): void;
}

export interface IRendererBody {
  readonly el: HTMLElement;
}

export interface IAbstractRenderer {
  readonly display: IRendererDisplay;
  readonly gutter: IRendererGutter;
  readonly body: IRendererBody;

  editor: IRendererEditorController;

  onAddRow(row: MRow): void;

  onRemoveRow(row: MRow): void;
}
