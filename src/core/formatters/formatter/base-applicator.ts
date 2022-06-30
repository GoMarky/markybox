import { EditorBodyNavigator } from '@/core/renderer/html/editor/EditorBodyNavigator';
import { EditorRowsController } from '@/core/renderer/html/editor/EditorRowsController';
import { BaseObject } from '@/core/objects/BaseObject';
import { CriticalError } from '@/base/errors';

export interface IAbstractKeyApplicator {
  setContext(navigator: EditorBodyNavigator, controller: EditorRowsController): void;

  backspace(): void;

  enter(): void;

  stopBackspaceAction(): void;
}

export class AbstractKeyApplicator extends BaseObject implements IAbstractKeyApplicator {
  protected navigator: EditorBodyNavigator;
  protected controller: EditorRowsController;

  protected backspaceKeyIntervalPressed: number = 0;
  protected currentBackspaceTimePressed: number = 0;

  constructor() {
    super();
  }

  private doBackspaceAction(): void {
    const { navigator, controller } = this;
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
      navigator.setPosition({ row: prevRow.index, column: prevRow.length - currentRowText.length })
      return;
    }

    const { currentBackspaceTimePressed } = this;

    if (currentBackspaceTimePressed >= 1000) {
      return this.removeGlyphByPosition(column);
    }

    return this.removeLetterByPosition(column);
  }

  protected removeGlyphByPosition(column: number): void {
    const { navigator, controller } = this;
    const { currentRow } = controller;

    const { fragment } = currentRow;

    if (!fragment) {
      throw new CriticalError('Expect fragment to be defined');
    }

    console.log(column);
  }

  protected removeLetterByPosition(column: number): void {
    const { navigator, controller } = this;
    const { currentRow } = controller

    if (column === 0) {
      return;
    }

    navigator.prevColumn();
    currentRow.clearLetterByPosition(column);
  }

  protected removeCurrentEmptyRow(): void {
    const { navigator, controller } = this;
    const { currentRow } = controller;
    const { index } = currentRow;

    controller.removeRow(currentRow);
    const prevRow = controller.prevRow;

    let column = 0;

    if (prevRow) {
      column = prevRow.length;
    }

    navigator.setPosition({ row: index - 1, column })
  }

  protected addEmptyRowAtPosition(index: number): void {
    const { navigator, controller } = this;
    const newIndex = index + 1;
    controller.addRowAt(newIndex);
    navigator.nextRow();
  }

  protected splitCurrentRow(): void {
    const { navigator, controller } = this;
    const { currentRow } = controller;
    const { position: { column } } = navigator;

    controller.splitCurrentRow(column);
    return navigator.setPosition({ row: currentRow.index, column: 0 })
  }

  public setContext(navigator: EditorBodyNavigator, controller: EditorRowsController): void {
    this.navigator = navigator;
    this.controller = controller;
  }

  public stopBackspaceAction(): void {
    window.clearInterval(this.backspaceKeyIntervalPressed);
    this.currentBackspaceTimePressed = 0;
  }

  public backspace(): void {
    this.backspaceKeyIntervalPressed = window.setInterval(() => {
      this.doBackspaceAction();
      this.currentBackspaceTimePressed += 100;
    }, 100);
  }

  public enter(): void {
  }
}
