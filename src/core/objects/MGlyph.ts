import { MObject } from '@/core/objects/MObject';

export abstract class MGlyph extends MObject {
  protected constructor() {
    super();
  }

  public abstract draw(): void
}
