/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServiceCollection } from '@/app/platform/instantiation/browser/collection';
import { Class } from '@/types/common';

export interface IServiceIdentifier<T = any> {
  (...args: any[]): void;

  type: T;
}

export const serviceIds = new Map<string, IServiceIdentifier>();

export const DI_TARGET = '$di$target';
export const DI_DEPENDENCIES = '$di$dependencies';

export function getServiceDependencies(
  ctor: Class
): { id: IServiceIdentifier; index: number; optional: boolean }[] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return ctor[DI_DEPENDENCIES] || [];
}

export function createDecorator<T>(serviceId: string): IServiceIdentifier<T> {
  if (serviceIds.has(serviceId)) {
    return serviceIds.get(serviceId) as IServiceIdentifier<T>;
  }

  const id = function(target: () => void, _key: string, index: number): any {
    if (arguments.length !== 3) {
      throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
    }
    storeServiceDependency(id, target, index, false);
  } as any;

  id.toString = (): string => serviceId;

  serviceIds.set(serviceId, id);

  return id;
}

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 * Accessor for communicate with another services.
 *
 * @see IInstantiationService.invokeFunction
 *
 */
export interface IServicesAccessor {
  get<T>(id: IServiceIdentifier<T>): T;
}

function storeServiceDependency(
  id: () => void,
  target: any,
  index: number,
  optional: boolean
): void {
  if (target[DI_TARGET] === target) {
    target[DI_DEPENDENCIES].push({ id, index, optional });
  } else {
    target[DI_DEPENDENCIES] = [{ id, index, optional }];
    target[DI_TARGET] = target;
  }
}

export interface IInstantiationService {
  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Create new Instantiation service (with all nested services).
   *
   * @param {ServiceCollection} services
   *
   * @returns IInstantiationService
   */
  createChild(services: ServiceCollection): IInstantiationService;

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   * Execute custom function with accessor property. Accessor using to communicate with other services.
   *
   *
   * @param fn {Function}
   * @param {any[]} args
   * @public
   *
   * @throws InstantiationError
   * @returns {T}
   */
  invokeFunction<R, TS extends any[] = []>(
    fn: (accessor: IServicesAccessor, ...args: TS) => R,
    ...args: TS
  ): R;

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Creating instance and injecting indicated (in instance constructor) services to it.
   *
   * @param options
   * @param {any[]} args
   * @public
   *
   * @throws InstantiationServiceError
   * @returns {T}
   */
  createInstance<T>(options: any, ...args: any[]): T;
  createInstance2<T>(ctor: any, id: IServiceIdentifier): T;
}

export const IInstantiationService = createDecorator<IInstantiationService>('instantiationService');
