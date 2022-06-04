import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { PlainKeyApplicator } from '@/core/formatters/plain/plain-applicator';

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
