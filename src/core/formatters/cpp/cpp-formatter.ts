import { AbstractKeyApplicator, BaseFormatter, CodeStatement, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-formatter';

class CPPKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor() {
    super();
  }

  public backspace() {
    super.backspace();
  }

  public enter() {
    super.enter();
  }
}

export class CPPCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;

  constructor() {
    super('json');

    this.applicator = new CPPKeyApplicator();
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
