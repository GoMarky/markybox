/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

import { isDefined } from '@/base/types';

export class Barrier {
  private _isOpen: boolean;
  private readonly _promise: Promise<boolean>;
  private _completePromise!: (v: boolean) => void;

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Create barrier for code.
   *  It create promise that you can resolve in any time you want. (By calling open method).
   */
  constructor() {
    this._isOpen = false;
    this._promise = new Promise<boolean>(c => {
      this._completePromise = c;
    });
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Flag that means does it barrier already open.
   *
   *  @return boolean
   */
  public isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Open barrier, or say in another words resolve promise inside barrier.
   *
   *  @return void
   */
  public open(): void {
    this._isOpen = true;
    this._completePromise(true);
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Get promise barrier.
   *
   *  @return Promise<boolean>
   */
  public wait(): Promise<boolean> {
    return this._promise;
  }
}

/**
 *
 * @see https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
 *
 * @param func
 * @param waitFor
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => ReturnType<F>) => {
  let timeout = 0;

  const debounced = (...args: any[]): void => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), waitFor);
  };

  return (debounced as unknown) as (...args: Parameters<F>) => ReturnType<F>;
};

type ThrottledFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>;

/**
 * Creates a throttled function that only invokes the provided function (`func`)
 * at most once per within a given number of milliseconds (`limit`)
 *
 * @see https://github.com/bameyrick/throttle-typescript
 */
export function throttle<T extends (...args: any) => any>(
  func: T,
  limit: number
): ThrottledFunction<T> {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any): ReturnType<T> {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    if (!inThrottle) {
      inThrottle = true;

      setTimeout(() => (inThrottle = false), limit);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lastResult = func.apply(context, args);
    }

    return lastResult;
  };
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Return promise that resolve after specified time.
 *
 *  @param {number} milliseconds - resolve timer
 *
 *  @return Promise<void>>
 */
export function timeout(milliseconds: number): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, milliseconds);
  });
}

/**
 * @see https://github.com/chodorowicz/ts-debounce/blob/master/src/index.ts
 */

export interface ITask<T> {
  (): T;
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  Try resolve promise specified times.
 *
 * @param {ITask} task - function
 * @param {number} delay - delay time before calling
 * @param {number} retries - retrying attempts.
 *
 * @return Promise<void>>
 */
export async function retry<T>(
  task: ITask<Promise<T>>,
  delay: number,
  retries: number
): Promise<T | undefined> {
  let lastError: Error | undefined;

  for (let i = 0; i < retries; i++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      await timeout(delay);
    }
  }

  if (lastError) {
    throw lastError;
  }

  return undefined;
}

/**
 * @see https://dev.to/sinxwal/looking-for-promise-any-let-s-quickly-implement-a-polyfill-for-it-1kga
 * @param {Iterable<PromiseLike<T> | T>} iterable
 * @returns {Promise<T>}
 */
const any = async <T>(iterable: Iterable<T | PromiseLike<T>>): Promise<T> => {
  return Promise.all(
    [...iterable].map(promise => {
      return new Promise((resolve, reject) => Promise.resolve(promise).then(reject, resolve));
    })
  ).then(
    errors => Promise.reject(errors),
    value => Promise.resolve<T>(value)
  );
};

/**
 *
 * @returns {<T>(values: ((PromiseLike<T> | T)[] | Iterable<PromiseLike<T> | T>)) => Promise<T>}
 */
export async function promiseAny<T>(iterable: Iterable<T | PromiseLike<T>>) {
  return isDefined(Promise.any) ? Promise.any(iterable) : any(iterable);
}
