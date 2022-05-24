import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';

export class PlainFormatter extends BaseFormatter {
  constructor() {
    super('plain');
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
