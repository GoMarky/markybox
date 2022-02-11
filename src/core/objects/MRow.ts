import { MObject } from '@/core/objects/MObject';

export class MRow extends MObject {
  constructor(
    public readonly index: number
  ) {
    super();
  }
}
