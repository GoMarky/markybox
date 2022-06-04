import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { CPPKeyApplicator } from '@/core/formatters/cpp/cpp-applicator';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { CppFactory } from '@/core/formatters/cpp/cpp-factory';

export class CPPCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;
  public readonly factory: IAbstractFormatterFactory;

  constructor() {
    super('json');

    this.applicator = new CPPKeyApplicator();
    this.factory = new CppFactory();
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
