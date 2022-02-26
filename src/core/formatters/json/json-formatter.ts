import { MObject } from '@/core/objects/MObject';
import { ICodeFormatter, IParsedFormatterWord } from '@/core/formatters/common';

export class JSONCodeFormatter extends MObject implements ICodeFormatter {
  constructor() {
    super();
  }

  public get name(): string {
    return 'json';
  }

  public parseKeywords(input: string): IParsedFormatterWord[] {
    console.log(input);
    return [];
  }
}
