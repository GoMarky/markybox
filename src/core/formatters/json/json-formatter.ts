import { MObject } from '@/core/objects/MObject';
import { IParsedFormatterWord } from '@/core/formatters/common';

export class JSONCodeFormatter extends MObject {
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
