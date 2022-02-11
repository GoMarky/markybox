import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { nanoid } from 'nanoid';

export abstract class MObject extends Disposable {
  public readonly id = nanoid(10000);
}
