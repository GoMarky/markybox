import { Char } from '@/base/char';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';

export class MHTMLEditorActiveState extends MHTMLEditorState {
  constructor() {
    super();
  }

  public onInput(char: MChar): void {
    const { controller, navigator } = this.renderer;
    const { position: { column, row } } = navigator;
    const { currentRow } = controller;

    currentRow.inputAt(char, column);
    navigator.setPosition({ row, column: column + 1 });
  }

  public onClick(event: MouseEvent): void {
    const { display, storage, navigator } = this.renderer;

    const { clientX, clientY } = event;
    const position = display.toEditorPosition({ top: clientY, left: clientX });
    const row = storage.at(position.row);

    if (row) {
      const column = position.column > row.columnsCount ? row.columnsCount : position.column;

      navigator.setPosition({ row: position.row, column });
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    const { storage, navigator, controller } = this.renderer;
    const code = event.code as Char;

    const rowsCount = storage.count;
    const { position: { row, column } } = navigator;

    switch (code) {
      case Char.ArrowLeft: {
        return navigator.prevColumn();
      }
      case Char.ArrowRight: {
        return navigator.nextColumn();
      }
      case Char.ArrowUp: {
        return navigator.setPosition({ row: row - 1, column: 0 })
      }
      case Char.ArrowDown: {
        const isCurrentPositionHasLastRow = (row + 1) === rowsCount;

        if (isCurrentPositionHasLastRow) {
          const { index } = controller.addEmptyRow();
          return navigator.setPosition({ row: index, column: 0 })
        }


        return navigator.nextRow();
      }
      case Char.Backspace: {
        this.backspace();
        return;
      }
      case Char.Enter: {
        controller.splitCurrentRow(column);
        return navigator.setPosition({ row: controller.currentRow.index, column: 0 })
      }
    }
  }

  private backspace(): void {
    const { navigator, controller, storage } = this.renderer;
    const { currentRow } = controller;

    const isCurrentRowEmpty = currentRow.empty();

    if (isCurrentRowEmpty) {
      return this.doRemoveLastEmptyRow();
    }

    const { position: { column } } = navigator;
    return this.removeLetterByPosition(column);
  }

  private removeLetterByPosition(column: number): void {
    const { navigator, controller } = this.renderer;
    const { currentRow } = controller

    if (column === 0) {
      return;
    }

    navigator.prevColumn();
    currentRow.clearLetterByPosition(column);
  }

  private doRemoveLastEmptyRow(): void {
    const { controller, storage, navigator } = this.renderer;

    controller.removeLastRow();
    const lastRow = storage.last();
    navigator.setPosition({ row: lastRow.index, column: 0 })
  }
}
