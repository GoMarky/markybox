import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { Session } from '@/code/session/common/session';
import { ISessionInfoRequestResponse } from '@/code/request/session-info/session-info-request';

export interface ISessionLoginRequestAttributes {
  readonly email: Session.UserEmail;
  readonly password: Session.UserPassword;
}

export class SessionLoginRequest extends HTTPRequest<ISessionLoginRequestAttributes, ISessionInfoRequestResponse, ISessionInfoRequestResponse> {
  public static readonly staticId = 'session-login';

  protected readonly endpoint: string = ENDPOINTS.SESSION_LOGIN;
  public readonly id: string = SessionLoginRequest.staticId;

  constructor() {
    super();
  }

  public async handle(): Promise<ResponseInstance<ISessionInfoRequestResponse, ISessionInfoRequestResponse>> {
    const response = await this.post(this.endpoint, this.getAttributes());
    return this.doHandle(response);
  }
}
