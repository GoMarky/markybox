import { MObject } from '@/core/objects/MObject';
import { IParsedFormatterWord } from '@/core/formatters/common';

export class CppCodeFormatter extends MObject {
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
