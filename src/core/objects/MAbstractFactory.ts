import { MObject } from '@/core/objects/MObject';

export interface IMRow {
}

export abstract class MAbstractFactory extends MObject {
  constructor() {
    super();
  }

  public abstract createMRow(): IMRow;
}
