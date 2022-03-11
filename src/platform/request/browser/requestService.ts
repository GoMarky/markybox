/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IHTTPRequestCallOptions,
  IHTTPRequestService,
  IRequestRegister,
} from '@/platform/request/common/requestService';

import { ILogService } from '@/platform/log/common/log';
import { IInstantiationService } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';

import { CriticalError } from '@/base/errors';
import { Class } from '@/types/common';
import { ILifecycleService } from '@/platform/lifecycle/browser/lifecycle';
import { isObject, isString } from '@/base/types';
import { AbortRequestToken, HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { HTTPRequestBody, HTTPRequestString } from '@/code/request/request';

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *
 * @class
 * @extends Disposable
 */
export class HTTPRequestService extends Disposable implements IHTTPRequestService {
  private readonly requests: Map<string, HTTPRequest<any, any, any>> = new Map();

  constructor(
    @ILogService private readonly logService: ILogService,
    @ILifecycleService private readonly lifecycleService: ILifecycleService,
    @IInstantiationService private readonly instantiationService: IInstantiationService
  ) {
    super();

    this.initialize();
  }

  public async call<TAttributes, TResponse, TReturn>(
    request: HTTPRequestString | HTTPRequestBody,
    data?: TAttributes,
    extraOptions?: IHTTPRequestCallOptions
  ): Promise<ResponseInstance<TResponse, TReturn>> {
    let requestName: HTTPRequestString;
    let token: AbortRequestToken | undefined;

    if (isObject(request)) {
      requestName = request.requestName;
      token = request.token;
    } else {
      requestName = request;
    }

    const additionalData: TAttributes | undefined = data;
    try {
      const response = await this.processRequest<TAttributes, TResponse, TReturn>(
        requestName,
        token,
        additionalData,
        extraOptions?.forcedEndpoint
      );

      return response;
    } catch (error) {
      if (error instanceof Error) {
        this.logService.warn(`
      RequestService#call - Request ${requestName} failed.
      Name: ${error.name};
      Message: ${error.message};
      `);
      }

      let requestAttempt: number | undefined = 0;

      if (extraOptions?.attempt) {
        requestAttempt = extraOptions.attempt + 1;
      }

      throw error;
    }
  }

  public registerRequest(requestStringName: HTTPRequestString, Ctor: Class): boolean {
    if (this.requests.has(requestStringName)) {
      this.logService.error(`Request ${requestStringName} already registered`);

      return false;
    }

    if (Ctor instanceof HTTPRequest) {
      this.logService.error(`Request ${Ctor} is not instance of HTTPRequest`);

      return false;
    }

    try {
      const instance: HTTPRequest = this.instantiationService.createInstance(Ctor);

      this.requests.set(requestStringName, instance as HTTPRequest);
    } catch (error) {
      this.logService.error(
        `HTTPRequestService#registerRequest`,
        `Error when register request: ${error}`
      );

      return false;
    }

    return true;
  }

  public registerRequests(requests: IRequestRegister[]): boolean {
    return requests.every((request: IRequestRegister) =>
      this.registerRequest(request.id, request.ctor)
    );
  }

  private async processRequest<TAttributes, TResponse, TReturn>(
    requestName: HTTPRequestString,
    token?: AbortRequestToken,
    data?: TAttributes,
    forcedEndpoint?: string
  ): Promise<ResponseInstance<TResponse, TReturn>> {
    const requestInstance = this.getRequestInstance<TAttributes | undefined, TResponse, TReturn>(
      requestName
    );

    const rawRequestURL = requestInstance.setAttributes(data).getRequestURL();

    const endpoint = isString(forcedEndpoint) ? forcedEndpoint : rawRequestURL;

    const response = await requestInstance
      .setEndpoint(endpoint)
      .setToken(token)
      .handle();

    return response;
  }

  private getRequestInstance<TAttributes, TResponse, TReturn>(
    requestName: HTTPRequestString
  ): HTTPRequest<TAttributes, TResponse, TReturn> {
    const request = this.requests.get(requestName);

    if (!request) {
      throw new CriticalError(
        `HTTPRequestService#processRequest - Request ${requestName} was not found`
      );
    }

    return request;
  }

  private initialize(): void {

  }
}
