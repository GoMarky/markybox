import { InternalError, NetworkError } from '@/base/errors';
import { AbortRequestToken } from '@/code/request/baseRequest';

const TIMEOUT_ERROR_NAME = 'TimeoutError';

export class TimeoutError extends NetworkError {
  public readonly name = TIMEOUT_ERROR_NAME;

  constructor(
    public readonly requestName: string,
    public readonly timeout: number,
    public readonly serverName: string
  ) {
    super(`Request ${requestName} failed because of exceeded timeout ${timeout}`, requestName);
  }
}

const DISCONNECT_ERROR_NAME = 'DisconnectError';

export class DisconnectError extends NetworkError {
  public readonly name = DISCONNECT_ERROR_NAME;

  constructor(public readonly requestName: string, public readonly serverName: string) {
    super(`Request ${requestName} failed because of disconnect`, requestName);
  }
}

const ABORT_REQUEST_ERROR_NAME = 'AbortRequestError';

export class AbortRequestError extends InternalError {
  public readonly name = ABORT_REQUEST_ERROR_NAME;

  constructor(public readonly requestName: string, public readonly reason: AbortRequestReason) {
    super(`Request ${requestName} was aborted because request is ${reason}`);
  }
}

export enum AbortRequestReason {
  Irrelevant = 'Irrelevant',
}

export type HTTPRequestString = string;

export interface HTTPRequestBody {
  requestName: string;
  token?: AbortRequestToken;
}
