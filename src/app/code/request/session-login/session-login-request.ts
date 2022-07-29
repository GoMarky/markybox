import { ENDPOINTS } from '@/app/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/app/code/request/baseRequest';
import { Session } from '@/app/code/session/common/session';
import { ISessionInfoRequestResponse } from '@/app/code/request/session-info/session-info-request';

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
