import { NetworkError } from '@/base/errors';

export enum HTTPStatusCode {
  Success = 200,
  BadRequest = 400,
  NotFound = 404,
  RequestTimeout = 408,
  ClientClosedRequest = 499,
  InternalServerError = 500,
}

export enum APIError {
  BadRequest = 1, // В запросе не определены какие-то обязательные поля
  NotFoundError = 2,
  UnexpectedError = 25,
}

const API_ERROR_NAME = 'ApiError';

export class ApiError<T = APIError> extends NetworkError {
  private readonly _type: T;
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
   * @param {string} requestName
   * @extends ApplicationError
   */
  constructor(
    message: string,
    type: T,
    requestName?: string
  ) {
    super(message, requestName);

    this.message = message;
    this._type = type;
  }

  public is(type: T): boolean {
    return this._type === type;
  }

  public oneOf(type: readonly T[]): boolean {
    return type.includes(this._type);
  }
}
