import { AbstractKeyApplicator, BaseFormatter, CodeStatement, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-formatter';

class PlainKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor() {
    super();
  }

  public backspace(): void {
    return super.backspace();
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
      return this.addEmptyRowAtPosition(currentRow.index);
    }

    return this.splitCurrentRow();
  }
}

export class PlainFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;

  constructor() {
    super('plain');

    this.applicator = new PlainKeyApplicator();
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
