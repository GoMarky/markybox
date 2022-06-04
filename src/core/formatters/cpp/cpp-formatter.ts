import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { CPPKeyApplicator } from '@/core/formatters/cpp/cpp-applicator';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';

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
