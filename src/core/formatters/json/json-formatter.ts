import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';

export class JSONCodeFormatter extends BaseFormatter {
  constructor() {
    super('json');
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
