import { IServiceIdentifier } from '@/app/platform/instantiation/common/instantiation';
import { Class } from '@/types/common';

const singletons: [IServiceIdentifier, Class][] = [];

export function registerSingleton<T>(id: IServiceIdentifier<T>, ctor: Class): void {
  singletons.push([id, ctor]);
}

export function getSingletonServiceDescriptors(): [IServiceIdentifier, Class][] {
  return singletons;
}
