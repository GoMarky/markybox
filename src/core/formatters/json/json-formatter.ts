import { MObject } from '@/core/objects/MObject';

export class JSONCodeFormatter extends MObject {
  constructor() {
    super();
  }

  public get name(): string {
    return 'json';
  }

  public parseKeywords(_: string) {
    return [];
  }
}
