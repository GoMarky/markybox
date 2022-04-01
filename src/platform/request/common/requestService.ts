import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Class } from '@/types/common';
import { IDisposable } from '@/platform/lifecycle/common/lifecycle';
import { HTTPRequestBody, HTTPRequestString } from '@/code/request/request';
import { ResponseInstance } from '@/code/request/baseRequest';

export const IRequestService = createDecorator<IRequestService>('RequestService');

export interface IRequestRegister {
  readonly id: HTTPRequestString;
  readonly ctor: Class;
}

export interface IHTTPRequestCallOptions {
  attempt?: number;
  readonly forcedEndpoint?: string;
}

export interface IRequestService {
  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   * [RU] Вызывает API запрос.
   *
   * @param {HTTPRequestString | HTTPRequestBody} request payload.
   * If request is HTTPRequest body it means that we have abort token there.
   * @param {object} [data={}]
   * @param {IHTTPRequestCallOptions} extraOptions
   *
   * @returns Promise<ResponseInstance<TResponse, TReturn>>
   */
  call<TAttributes, TResponse, TReturn>(
    request: HTTPRequestString | HTTPRequestBody,
    data?: TAttributes,
    extraOptions?: IHTTPRequestCallOptions
  ): Promise<ResponseInstance<TResponse, TReturn>>;

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Register request for having possibility it calling.
   *
   * @param {string} requestStringName
   * @param {Class} request
   *
   * @return boolean - does request was successfully registered.
   */
  registerRequest(requestStringName: HTTPRequestString, request: Class): boolean;

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Register requests for having possibility it calling.
   *
   * @param {IRequestRegister[]} requests
   *
   * @return boolean - does all requests was successfully registered.
   */
  registerRequests(requests: IRequestRegister[]): boolean;
}
