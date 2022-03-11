import { NetworkError } from '@/base/errors';

export enum HTTPStatusCode {
  Success = 200,
  BadRequest = 400,
  NotFound = 404,
  RequestTimeout = 408,
  ClientClosedRequest = 499,
  InternalServerError = 500,
}

/**
 * @description
 * More API Errors here:
 *
 * @see https://confluence.fbsvc.bz/confluence/pages/viewpage.action?pageId=3866818
 */
export enum APIError {
  BadRequest = 1, // В запросе не определены какие-то обязательные поля
}

const API_ERROR_NAME = 'ApiError';

/**
 * @author Teodor_Dre <swen295@gmail.com>
 *
 * @description
 *  API Error instance.
 *
 *  @see https://confluence.fbsvc.bz/confluence/pages/viewpage.action?pageId=3866759
 *
 */
export class ApiError<T = APIError> extends NetworkError {
  private readonly _type: T;

  public readonly errorValue: string;
  public readonly name = API_ERROR_NAME;

  public get type(): T {
    return this._type;
  }

  /**
   * @author Teodor_Dre <swen295@gmail.com>
   *
   * @description
   *  Create instance of ApiError
   *
   * @param {string} message
   * @param {APIError} type
   * @param errorValue
   * @param serverName
   * @param {string} requestName
   * @extends ApplicationError
   */
  constructor(
    message: string,
    type: T,
    errorValue: string,
    public readonly serverName: string,
    requestName?: string
  ) {
    super(message, requestName);

    this.message = message;
    this.errorValue = errorValue;
    this._type = type;
  }

  public is(type: T): boolean {
    return this._type === type;
  }

  public oneOf(type: readonly T[]): boolean {
    return type.includes(this._type);
  }
}
