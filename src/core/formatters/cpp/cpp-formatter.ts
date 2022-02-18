import { MObject } from '@/core/objects/MObject';
import { ICodeFormatter, IParsedFormatterWord } from '@/core/formatters/common';

export class CppCodeFormatter extends MObject implements ICodeFormatter {
  constructor() {
    super();
  }

  public get name(): string {
    return 'cpp';
  }

  public parseKeywords(_: string): IParsedFormatterWord[] {
    return [];
  }
}
