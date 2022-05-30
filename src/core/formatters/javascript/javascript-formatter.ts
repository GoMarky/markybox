import { BaseFormatter, CodeStatement, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-formatter';
import { MObject } from '@/core/objects/MObject';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';
import { copyStringNumberOfTimes } from '@/base/string';
import { BASE_INDENT_VALUE } from '@/core/renderer/html/common/helpers';

export type StatementClassName =
  'm-editor__plain'
  | 'm-editor__keyword-identifier'
  | 'm-editor__keyword-identifier-name';

export const Regexp = {
  VariableStatement: /^(throw|as|this|void|undefined|string|number|object|super|return|new|default|const|let|var|class|function|export|import|interface|type|public|private|static|protected|extends|implements|switch|case|break|continue$)/,
};

class JavascriptKeyApplicator extends MObject implements IAbstractKeyApplicator {
  constructor() {
    super();
  }

  private removeLetterByPosition(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController, column: number): void {
    const { currentRow } = controller

    if (column === 0) {
      return;
    }

    navigator.prevColumn();
    currentRow.clearLetterByPosition(column);
  }

  private removeCurrentEmptyRow(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void {
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

  private addRowAtPositionWithIndent(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController, index: number): void {
    // Индекс строчки с пробелами
    const indentRowIndex = index + 1;
    // Индекс строчки с правой скобкой
    const rightParenRowIndex = indentRowIndex + 1;
    // Строчка с пробелами, добавляем ее в редактор
    const indentRow = controller.addRowAt(indentRowIndex);

    // Считаем количество отступов (учитываем соседние скобки до этого)
    const amountLeftParen = controller.getLeftParenAmountFromStartByIndex(indentRowIndex);
    const amountRightParen = controller.getRightParenAmountFromStartByIndex(indentRowIndex);
    // Выставляем нужно количество пробелов в зависимости от количества левых скобок
    const indentWhitespace = copyStringNumberOfTimes(BASE_INDENT_VALUE, amountLeftParen);
    indentRow.setText(indentWhitespace);

    const existRightParenWindow = controller.findClosestRightParenRowDown(indentRowIndex);

    if (existRightParenWindow) {
      const rightParenRow = controller.addRowAt(rightParenRowIndex);
      rightParenRow.setText(copyStringNumberOfTimes(BASE_INDENT_VALUE, amountLeftParen - 1) + '}');
    } else {
      const rightParenRow = controller.addRowAt(rightParenRowIndex);
      rightParenRow.setText('}');
    }

    navigator.setPosition({ row: indentRowIndex, column: indentWhitespace.length });
  }

  private addEmptyRowAtPosition(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController, index: number): void {
    const newIndex = index + 1;
    controller.addRowAt(newIndex);
    navigator.nextRow();
  }

  private splitCurrentRow(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void {
    const { currentRow } = controller;
    const { position: { column } } = navigator;

    controller.splitCurrentRow(column);
    return navigator.setPosition({ row: currentRow.index, column: 0 })
  }

  public backspace(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void {
    const { currentRow } = controller;

    /**
     * Если текущая строка пустая - удаляем ее.
     */
    if (currentRow.empty()) {
      return this.removeCurrentEmptyRow(navigator, controller);
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

    return this.removeLetterByPosition(navigator, controller, column);
  }

  public enter(navigator: MHTMLEditorBodyNavigator, controller: MHTMLEditorController): void {
    const { currentRow } = controller;
    const { position } = navigator;
    const isCurrentRowEmpty = currentRow.empty();

    const isChosenLastLetter = position.column >= currentRow.columnsCount;

    /**
     * Если текущая строка пустая - просто добавляем еще пустую строку
     */
    if (isCurrentRowEmpty) {
      return this.addEmptyRowAtPosition(navigator, controller, currentRow.index);
    }

    /**
     * Если текущий символ - последний
     */
    if (isChosenLastLetter) {
      // Если текущий символ - это lparen -> { / [ / (
      if (currentRow.isLastCharOpenBracket()) {
        return this.addRowAtPositionWithIndent(navigator, controller, currentRow.index);
      } else {
        // Если текущий символ последний иной - то добавляем пустую строку.
        return this.addEmptyRowAtPosition(navigator, controller, currentRow.index);
      }
    }

    return this.splitCurrentRow(navigator, controller,);
  }
}

export class JavascriptCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;

  constructor() {
    super('js');

    this.applicator = new JavascriptKeyApplicator();
  }

  public parseKeyword(input: string): CodeStatement | undefined {
    const isVariableStatement = Regexp.VariableStatement.test(input);

    switch (true) {
      case isVariableStatement:
        return CodeStatement.VariableDeclaration;
      default:
        return CodeStatement.Text;
    }
  }
}

