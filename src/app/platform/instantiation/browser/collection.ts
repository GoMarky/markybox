/* eslint-disable @typescript-eslint/no-explicit-any */

import { IServiceIdentifier } from '../common/instantiation';

export class ServiceCollection {
  private readonly _entries = new Map<IServiceIdentifier, any>();

  constructor(...entries: [IServiceIdentifier, any][]) {
    for (const [id, service] of entries) {
      this.set(id, service);
    }
  }

  public set<T>(id: IServiceIdentifier<T>, instanceOrDescriptor: T): T {
    const result = this._entries.get(id);
    this._entries.set(id, instanceOrDescriptor);

    return result;
  }

  public forEach(callback: (id: IServiceIdentifier, instanceOrDescriptor: any) => any): void {
    this._entries.forEach((value, key) => callback(key, value));
  }

  public has(id: IServiceIdentifier): boolean {
    return this._entries.has(id);
  }

  public get<T>(id: IServiceIdentifier<T>): T {
    return this._entries.get(id);
  }
}
