import { AbstractKeyApplicator, BaseFormatter, CodeStatement, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-formatter';
import { copyStringNumberOfTimes } from '@/base/string';
import { BASE_INDENT_VALUE } from '@/core/renderer/html/common/helpers';
import { ParenType } from '@/core/renderer/html/common/MHTMLGlyphParen';

export type StatementClassName =
  'm-editor__plain'
  | 'm-editor__keyword-identifier'
  | 'm-editor__keyword-identifier-name';

const Regexp = {
  VariableStatement: /^(throw|as|this|void|undefined|string|number|object|super|return|new|default|const|let|var|class|function|export|import|interface|type|public|private|static|protected|extends|implements|switch|case|break|continue$)/,
};

class JavascriptKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
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
      rightParenRow.setText(copyStringNumberOfTimes(BASE_INDENT_VALUE, amountLeftParen - 1) + '}');
    } else {
      const rightParenRow = controller.addRowAt(rightParenRowIndex);
      rightParenRow.setText('}');
    }

    navigator.setPosition({ row: indentRowIndex, column: indentWhitespace.length });
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
      // Если текущий символ - это lparen -> { / [ / (
      if (currentRow.lastCharIs(ParenType.OpenBracket)) {
        return this.addRowAtPositionWithIndent(currentRow.index);
      } else {
        // Если текущий символ последний иной - то добавляем пустую строку.
        return this.addEmptyRowAtPosition(currentRow.index);
      }
    }

    return this.splitCurrentRow();
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

