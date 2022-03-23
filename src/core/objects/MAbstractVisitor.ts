import { MObject } from '@/core/objects/MObject';

export abstract class MAbstractVisitor<T> extends MObject {
  public abstract visit(fragment: T): void;
}
