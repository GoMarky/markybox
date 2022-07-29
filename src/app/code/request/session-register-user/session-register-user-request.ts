import { ENDPOINTS } from '@/app/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/app/code/request/baseRequest';
import { Session } from '@/app/code/session/common/session';
import { ISessionInfoRequestResponse } from '@/app/code/request/session-info/session-info-request';

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
