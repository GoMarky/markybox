import { Disposable, DisposableStore } from '@/platform/lifecycle/common/lifecycle';
import { nanoid } from 'nanoid';

export abstract class MObject extends Disposable {
  protected disposables: DisposableStore = new DisposableStore();

  public readonly id = nanoid(10000);
}
