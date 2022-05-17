import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { Session } from '@/code/session/common/session';
import { ISessionInfoRequestResponse } from '@/code/request/session-info/session-info-request';

export interface ISessionRegisterUserRequestAttributes {
  readonly email: Session.UserEmail;
  readonly password: Session.UserPassword;
  readonly userName: Session.UserName;
}

export class SessionRegisterUserRequest extends HTTPRequest<ISessionRegisterUserRequestAttributes, ISessionInfoRequestResponse, ISessionInfoRequestResponse> {
  public static readonly staticId = 'session-register';

  protected readonly endpoint: string = ENDPOINTS.SESSION_REGISTER_USER;
  public readonly id: string = SessionRegisterUserRequest.staticId;

  constructor() {
    super();
  }

  public async handle(): Promise<ResponseInstance<ISessionInfoRequestResponse, ISessionInfoRequestResponse>> {
    const response = await this.post(this.endpoint, this.getAttributes());
    return this.doHandle(response);
  }
}
