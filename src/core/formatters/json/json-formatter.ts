import { BaseFormatter, CodeStatement} from '@/core/formatters/formatter/base-formatter';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { JSONKeyApplicator } from '@/core/formatters/json/json-applicator';

export class JSONCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;

  constructor() {
    super('json');

    this.applicator = new JSONKeyApplicator();
  }

  public parseKeyword(_: string): CodeStatement | undefined {
    return CodeStatement.Text;
  }
}
