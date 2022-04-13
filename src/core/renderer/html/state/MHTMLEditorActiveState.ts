import { Char } from '@/base/char';
import { MHTMLEditorState } from '@/core/renderer/html/state/MHTMLEditorState';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { IPosition } from '@/core/app/common';

const BASE_INDENT_VALUE = '    ';

export class MHTMLEditorActiveState extends MHTMLEditorState {
  constructor() {
    super();
  }

  public onSelectionStart(event: MouseEvent): void {
    const { selection } = this.renderer;
    const { display } = this.renderer;

    const { clientX, clientY } = event;

    if (selection.startPosition) {
      selection.lastPosition = null;
      selection.clearSelect();
    }

    selection.started = true;
    selection.startPosition = display.toEditorPosition({ left: clientX, top: clientY });
  }

  public onSelectionMove(event: MouseEvent): void {
    const { selection } = this.renderer;

    if (!selection.started) {
      return;
    }

    const { display } = this.renderer;
    const { clientX, clientY } = event;
    selection.lastPosition = display.toEditorPosition({ left: clientX, top: clientY });

    const start = selection.startPosition as IPosition;
    const end = selection.lastPosition;

    selection.updateSelection({ start, end });
  }

  public onSelectionEnd(_: MouseEvent): void {
    const { selection } = this.renderer;

    selection.started = false;
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
    const { position: { row } } = navigator;

    switch (code) {
      case Char.ArrowLeft:
        return navigator.prevColumn();
      case Char.ArrowRight:
        return navigator.nextColumn();
      case Char.ArrowUp: {
        return navigator.setPosition({ row: row - 1, column: 0 })
      }
      case Char.ArrowDown: {
        const isCurrentPositionHasLastRow = (row + 1) === storage.count;

        if (isCurrentPositionHasLastRow) {
          const { index } = controller.addEmptyRow();
          return navigator.setPosition({ row: index, column: 0 })
        }


        return navigator.nextRow();
      }
      case Char.Backspace:
        return this.backspace();
      case Char.Enter:
        return this.enter();
    }
  }

  private enter(): void {
    const { navigator, controller } = this.renderer;
    const { currentRow } = controller;
    const isCurrentRowEmpty = currentRow.empty();
    const { position } = navigator;

    const isChosenLastLetter = position.column >= currentRow.columnsCount;

    /**
     * Если текущая строка пустая - просто добавляем еще пустую строку
     */
    if (isCurrentRowEmpty) {
      return this.addEmptyRowAtPosition(currentRow.index);
    }

    /**
     * Если текущий символ - последний
     */
    if (isChosenLastLetter) {
      // Если текущий символ - это lparen -> { / [ / (
      if (currentRow.isLastCharLeftParen()) {
        return this.addRowAtPositionWithIndent(currentRow.index);
      } else {
        // Если текущий символ последний иной - то добавляем пустую строку.
        return this.addEmptyRowAtPosition(currentRow.index);
      }
    }

    return this.splitCurrentRow();
  }

  private backspace(): void {
    const { navigator, controller } = this.renderer;
    const { currentRow } = controller;

    /**
     * Если текущая строка пустая - удаляем ее.
     */
    if (currentRow.empty()) {
      return this.removeCurrentEmptyRow();
    }

    /**
     * Если текущая строка содержит только пробелы, то не удаляем ее - а просто очищаем от пробелов
     */
    if (currentRow.containsOnlyWhitespaces()) {
      navigator.setPosition({ row: currentRow.index, column: 0 })
      return currentRow.erase();
    }

    const { position: { column } } = navigator;

    /**
     * Если мы находимся в начале строки и
     * предыдущая строчка пустая -> то удаляем предыдущую строчку.
     */
    if (column === 0 && controller.prevRow?.empty()) {
      controller.removeRow(controller.prevRow);
      navigator.setPosition({ row: currentRow.index, column })
      return;
    }

    /**
     * Если мы находимся в начале строки и
     * предыдущая строчка НЕ пустая, то склеиваем текущую
     * с предыдущей.
     * Текущую удаляем
     */
    if (column === 0 && controller.prevRow && !controller.prevRow?.empty()) {
      const currentRowText = controller.currentRow.text;

      const prevRow = controller.prevRow;
      prevRow.append(currentRowText);
      controller.removeRow(controller.currentRow);
      navigator.setPosition({ row: prevRow.index, column: prevRow.columnsCount - currentRowText.length })
      return;
    }

    return this.removeLetterByPosition(column);
  }

  private addRowAtPositionWithIndent(index: number): void {
    const { navigator, controller } = this.renderer;

    const indentRowIndex = index + 1;
    const rightParenRowIndex = indentRowIndex + 1;

    const indentRow = controller.addRowAt(indentRowIndex);
    indentRow.setText(BASE_INDENT_VALUE);

    const rightParenRow = controller.addRowAt(rightParenRowIndex);
    rightParenRow.setText('}');

    navigator.setPosition({ row: indentRow.index, column: 4 });
  }

  private addEmptyRowAtPosition(index: number): void {
    const { navigator, controller } = this.renderer;

    const newIndex = index + 1;
    controller.addRowAt(newIndex);
    navigator.nextRow();
  }

  private splitCurrentRow(): void {
    const { navigator, controller } = this.renderer;
    const { currentRow } = controller;
    const { position: { column } } = navigator;

    controller.splitCurrentRow(column);
    return navigator.setPosition({ row: currentRow.index, column: 0 })
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

  private removeCurrentEmptyRow(): void {
    const { controller, storage, navigator } = this.renderer;
    const { currentRow } = controller;
    const { index } = currentRow;

    storage.removeRow(currentRow);
    const prevRow = controller.prevRow;

    let column = 0;

    if (prevRow) {
      column = prevRow.columnsCount;
    }

    navigator.setPosition({ row: index - 1, column })
  }
}
