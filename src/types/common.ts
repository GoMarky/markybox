/* eslint-disable @typescript-eslint/no-explicit-any */

export type FunctionLike<T = void> = (...args: any[]) => T;

export interface Class<T = any> {
  new (...args: any[]): T;
}
