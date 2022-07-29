/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  getServiceDependencies,
  IInstantiationService,
  IServiceIdentifier,
  IServicesAccessor,
} from '@/app/platform/instantiation/common/instantiation';
import { ServiceCollection } from '@/app/platform/instantiation/browser/collection';
import { Class } from '@/types/common';
import { ApplicationError } from '@/base/errors';

/**
 * @description
 *  Instantiation error
 */
export class InstantiationError extends ApplicationError {
  public readonly name = 'InstantiationError';
}

/**
 * @description
 *  Indicates that service was not created due incorrect dependency injection.
 *
 */
export class InstantiationServiceError extends InstantiationError {
  constructor(serviceName: string, serviceId: IServiceIdentifier<unknown>) {
    super();

    this.message = `[createInstance] ${serviceName} depends on UNKNOWN service ${serviceId}.`;
  }
}

export class InstantiationService implements IInstantiationService {
  private readonly _services: ServiceCollection;
  private readonly _strict: boolean;
  private readonly _parent?: InstantiationService;

  constructor(
    services: ServiceCollection = new ServiceCollection(),
    strict = false,
    parent?: InstantiationService
  ) {
    this._services = services;
    this._strict = strict;
    this._parent = parent;

    this._services.set(IInstantiationService, this);
  }

  public invokeFunction<R, TS extends any[] = []>(
    fn: (accessor: IServicesAccessor, ...args: TS) => R,
    ...args: TS
  ): R {
    let _done = false;

    try {
      const accessor: IServicesAccessor = {
        get: <T>(id: IServiceIdentifier<T>) => {
          if (_done) {
            console.warn(
              'service accessor is only valid during the invocation of its target method'
            );
          }

          const result = this._services.get(id);

          if (!result) {
            throw new InstantiationError(`[invokeFunction] unknown service '${id}'`);
          }

          return result;
        },
      };
      return (fn as any).apply(undefined, [accessor, ...args]);
    } finally {
      _done = true;
    }
  }

  public createChild(services: ServiceCollection): IInstantiationService {
    return new InstantiationService(services, this._strict, this);
  }

  public createInstance<T>(ctor: Class, ...args: any[]): T {
    const instance: any = this._createInstance<T>(ctor, args);

    if (instance.serviceBrand) {
      this._services.set(instance.serviceBrand, instance);
    }

    return instance;
  }

  public createInstance2<T>(ctor: Class, id: IServiceIdentifier): T {
    const instance = this._createInstance<T>(ctor);

    this._services.set(id, instance);

    return instance;
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @see createInstance
   *
   * @param {any} ctor
   * @param {any[]} args
   * @private
   *
   * @throws InstantiationServiceError
   * @returns {T}
   */
  private _createInstance<T>(ctor: Class, args: any[] = []): T {
    const serviceDependencies = getServiceDependencies(ctor).sort((a, b) => a.index - b.index);
    const serviceArgs: any[] = [];

    for (const dependency of serviceDependencies) {
      const service = this.getServiceInstance(dependency.id);

      if (!service && this._strict && !dependency.optional) {
        throw new InstantiationServiceError(ctor.name, dependency.id);
      }

      serviceArgs.push(service);
    }

    const finalArgs = [...[...args, ...serviceArgs]];

    return <T>new ctor(...finalArgs);
  }

  private getServiceInstance(id: IServiceIdentifier): any {
    const service = this._services.get(id);

    if (service) {
      return service;
    }
  }
}
