import { MObject } from '@/core/objects/MObject';
import { EditorLang } from '@/core';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';

export enum CodeStatement {
  Text = 'text',
  VariableDeclaration = 'VariableDeclaration',
}

export interface IAbstractKeyApplicator {
  setContext(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void;

  backspace(): void;

  enter(): void;
}

export class AbstractKeyApplicator extends MObject implements IAbstractKeyApplicator {
  protected navigator: MHTMLEditorBodyNavigator;
  protected controller: MHTMLEditorController;

  constructor() {
    super();
  }

  protected removeLetterByPosition( column: number): void {
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
      column = prevRow.columnsCount;
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

  public setContext(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void {
    this.navigator = navigator;
    this.controller = controller;
  }

  public backspace(): void {
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
      navigator.setPosition({ row: prevRow.index, column: prevRow.columnsCount - currentRowText.length })
      return;
    }

    return this.removeLetterByPosition(column);
  }

  public enter(): void {
  }
}

export abstract class BaseFormatter extends MObject {
  public abstract readonly applicator: IAbstractKeyApplicator;

  protected constructor(public readonly name: EditorLang) {
    super();
  }

  public abstract parseKeyword(input: string): CodeStatement | undefined;

  public setContext(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void {
    this.applicator.setContext(navigator, controller);
  }

  public toString(): string {
    return this.name;
  }
}
