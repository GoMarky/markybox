import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';

export class PythonCodeFormatter extends BaseFormatter {
  constructor() {
    super('python');
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
