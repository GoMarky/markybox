import { MObject } from '@/core/objects/MObject';

export interface IMRow {
  readonly index: number;
}

export abstract class MAbstractFactory extends MObject {
  constructor() {
    super();
  }

  public abstract createMRow(): IMRow;
}
