import { MObject } from '@/core/objects/MObject';
import { ICodeFormatter } from '@/core/formatters/common';

export class JavascriptCodeFormatter extends MObject implements ICodeFormatter {
  constructor() {
    super();
  }

  public get name(): string {
    return 'javascript';
  }
}
