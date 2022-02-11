import { CriticalError } from '@/base/errors';

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Dispose thing
 */
export interface IDisposable {
  dispose(): void;
}

export function toDisposable(func: () => void): IDisposable {
  return {
    dispose: () => {
      Reflect.apply(func, undefined, []);
    },
  };
}

export abstract class Disposable implements IDisposable {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {}

  public dispose(): void {
    //
  }
}

export class DisposableStore implements IDisposable {
  private readonly _toDispose = new Set<IDisposable>();
  private _isDisposed = false;

  public dispose(): void {
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;
    this.clear();
  }

  public clear(): void {
    this._toDispose.forEach(item => item.dispose());
    this._toDispose.clear();
  }

  public add<T extends IDisposable>(t: T): T {
    if (!t) {
      return t;
    }

    if (((t as unknown) as DisposableStore) === this) {
      throw new CriticalError('Cannot register a disposable on itself!');
    }

    if (this._isDisposed) {
      console.warn('Registering disposable on object that has already been disposed of');

      t.dispose();
    } else {
      this._toDispose.add(t);
    }

    return t;
  }
}
