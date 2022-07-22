import { Disposable, DisposableStore } from '@/platform/lifecycle/common/lifecycle';
import { nanoid } from 'nanoid';

export abstract class BaseObject extends Disposable {
  protected disposables: DisposableStore = new DisposableStore();

  public readonly id = nanoid(10);
}
