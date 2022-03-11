import { MObject } from '@/core/objects/MObject';

export class TextCodeFormatter extends MObject  {
  constructor() {
    super();
  }

  public get name(): string {
    return 'text';
  }
}
