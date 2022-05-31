import { AbstractKeyApplicator, BaseFormatter, CodeStatement, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-formatter';
import { ParenType } from '@/core/renderer/html/common/MHTMLGlyphParen';
import { copyStringNumberOfTimes } from '@/base/string';
import { BASE_INDENT_VALUE } from '@/core/renderer/html/common/helpers';

const Regexp = {
  VariableStatement: /^(def|class|False|await|else|import|pass|None|break|except|in|rais|True|finally|is|return|and|continue|for|lambda|try|as|from|nonlocal|while|assert|del|global|not|with|async|elif|if|or|yield$)/,
};

class PythonKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor() {
    super();
  }

  private addRowAtPositionWithIndent(index: number): void {
    const { navigator, controller } = this;
    // Индекс строчки с пробелами
    const indentRowIndex = index + 1;
    // Индекс строчки с правой скобкой
    const rightParenRowIndex = indentRowIndex + 1;
    // Строчка с пробелами, добавляем ее в редактор
    const indentRow = controller.addRowAt(indentRowIndex);

    // Считаем количество отступов (учитываем соседние скобки до этого)
    const amountLeftParen = controller.getLeftParenAmountFromStartByIndex(indentRowIndex);
    // Выставляем нужно количество пробелов в зависимости от количества левых скобок
    const indentWhitespace = copyStringNumberOfTimes(BASE_INDENT_VALUE, amountLeftParen);
    indentRow.setText(indentWhitespace);

    const existRightParenWindow = controller.findClosestRightParenRowDown(indentRowIndex);

    if (existRightParenWindow) {
      const rightParenRow = controller.addRowAt(rightParenRowIndex);
      rightParenRow.setText(copyStringNumberOfTimes(BASE_INDENT_VALUE, amountLeftParen - 1));
    } else {
      controller.addRowAt(rightParenRowIndex);
    }

    navigator.setPosition({ row: indentRowIndex, column: indentWhitespace.length });
  }

  public backspace(): void {
    super.backspace();
  }

  public enter(): void {
    const { navigator, controller } = this;
    const { currentRow } = controller;
    const { position } = navigator;
    const isCurrentRowEmpty = currentRow.empty();

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
      // Если текущий символ - это lparen -> :

      const isLastCharColon = currentRow.lastCharIs(ParenType.Colon);

      if (isLastCharColon) {
        return this.addRowAtPositionWithIndent(currentRow.index);
      } else {
        // Если текущий символ последний иной - то добавляем пустую строку.
        return this.addEmptyRowAtPosition(currentRow.index);
      }
    }

    return this.splitCurrentRow();
  }
}

export class PythonCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;

  constructor() {
    super('python');

    this.applicator = new PythonKeyApplicator();
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
