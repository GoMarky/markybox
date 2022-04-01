import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CancelToken,
  CancelTokenSource,
} from 'axios';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import * as types from '@/base/types';
import { CriticalError } from '@/base/errors';
import { AbortRequestError, AbortRequestReason, DisconnectError, TimeoutError } from '@/code/request/request';
import { FunctionLike } from '@/types/common';
import { ensureNoFirstSlash } from '@/base/string';
import { ApiError } from '@/platform/request/common/request';

const DEFAULT_TIMEOUT_TIME = 15000;

export type FunctionLikeReturnString = FunctionLike<string>;

export class BaseTransformer extends Disposable {
  constructor() {
    super();
  }

  public static createNullInstance(): BaseTransformer {
    return new BaseTransformer();
  }

  public transform(response: AxiosResponse): unknown {
    return response.data;
  }

  public reset(): this {
    return this;
  }
}

export class ResponseInstance<TResponse, TReturn> extends Disposable {
  public data: TReturn;

  constructor(
    public readonly response: AxiosResponse<TResponse>,
    public readonly serverName: string,
    public readonly requestName?: string
  ) {
    super();
  }

  public setData(data: TReturn): void {
    this.data = data;
  }

  public getOriginalResult(): AxiosResponse<TResponse> {
    return this.response;
  }
}

export type EndpointMethod = (
  ...args: (string & Record<string, unknown> & boolean & number)[]
) => string;

export abstract class HTTPRequest<TAttributes = unknown, TResponse = unknown, TReturn = unknown> {
  protected readonly axios: AxiosInstance;

  protected abstract readonly endpoint: string | EndpointMethod;
  protected token: AbortRequestToken | null = null;

  public attributes: TAttributes;
  public transformer: BaseTransformer;

  public abstract readonly id: string;

  protected constructor() {
    this.axios = axios.create({
      timeout: DEFAULT_TIMEOUT_TIME,
      baseURL: 'http://localhost:3000',
    });

    this.transformer = BaseTransformer.createNullInstance();
  }

  private static handleNativeError(
    requestName: string,
    error: AxiosError,
    endpoint: string,
    token?: AbortRequestToken | null
  ): never {
    if (error.response?.data?.code) {
      const { message, code } = error.response.data;

      throw new ApiError(message, code, requestName)
    }

    if (error.message === 'Network Error') {
      throw new DisconnectError(requestName, endpoint);
    }

    if (error.code === 'ECONNABORTED') {
      throw new TimeoutError(requestName, DEFAULT_TIMEOUT_TIME, endpoint);
    }

    if (axios.isCancel(error) && token?.bubbleError) {
      throw new AbortRequestError(requestName, error.message as AbortRequestReason);
    }

    throw error;
  }

  public setEndpoint(endpoint: string): this {
    if (types.isString(endpoint)) {
      return this;
    }

    return this;
  }

  public setAttributes(attributes: TAttributes): this {
    this.attributes = attributes;

    return this;
  }

  public getAttribute(key: keyof TAttributes): TAttributes[keyof TAttributes] | null {
    if (this.attributes && (this.attributes as Record<string, unknown>).hasOwnProperty(key)) {
      return this.attributes[key];
    }

    return null;
  }

  public getAttributes(): TAttributes {
    return this.attributes;
  }

  public setTransformer(transformer?: BaseTransformer): this {
    this.transformer = transformer || this.transformer;

    return this;
  }

  public setToken(token?: AbortRequestToken): this {
    // remove old token if it exist
    if (this.token) {
      this.token = null;
    }

    this.token = token || null;

    return this;
  }

  public getRequestURL(): string {
    const endpoint = this.endpoint as string;

    if (types.isString(endpoint)) {
      return endpoint;
    } else {
      throw new CriticalError(`Unrecognized this.endpoint property for request: ${this.id}`);
    }
  }

  public abstract handle(): Promise<ResponseInstance<TResponse, TReturn>>;

  protected doHandle(response: AxiosResponse<TResponse>): ResponseInstance<TResponse, TReturn> {
    const endpoint = this.axios.defaults.baseURL as string;
    const responseInstance = new ResponseInstance<TResponse, TReturn>(response, endpoint, this.id);

    const result = this.transformer.transform(response);
    responseInstance.setData(result as TReturn);

    return responseInstance;
  }

  protected async get(url: string, config?: Record<string, unknown>): Promise<AxiosResponse> {
    try {
      return await this.axios.get(url, {
        ...config,
        cancelToken: this.getAbortToken(),
      });
    } catch (error) {
      return HTTPRequest.handleNativeError(
        this.id,
        error,
        this.axios.defaults.baseURL as string,
        this.token
      );
    }
  }

  protected async post(
    url: string,
    data: TAttributes | null,
    config?: Record<string, unknown>
  ): Promise<AxiosResponse> {
    try {
      return await this.axios.post(url, data, {
        ...config,
        cancelToken: this.getAbortToken(),
      });
    } catch (error) {
      return HTTPRequest.handleNativeError(
        this.id,
        error,
        this.axios.defaults.baseURL as string,
        this.token
      );
    }
  }

  private getAbortToken(): CancelToken | undefined {
    return this.token?.source.token;
  }
}

export interface IAbortRequestCreationOptions {
  bubbleError: boolean;
}

const DEFAULT_ABORT_REQUEST_OPTIONS: IAbortRequestCreationOptions = {
  bubbleError: false,
};

export class AbortRequestToken extends Disposable {
  public source: CancelTokenSource = axios.CancelToken.source();

  public readonly bubbleError: boolean;

  constructor(options: IAbortRequestCreationOptions = DEFAULT_ABORT_REQUEST_OPTIONS) {
    super();

    this.bubbleError = options.bubbleError;
  }

  public execute(reason: AbortRequestReason = AbortRequestReason.Irrelevant): this {
    this.source.cancel(reason);

    return this;
  }

  public dispose(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.source = null!;
  }
}
