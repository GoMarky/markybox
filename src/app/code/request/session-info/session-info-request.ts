import { ENDPOINTS } from '@/app/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/app/code/request/baseRequest';
import { Session } from '@/app/code/session/common/session';
import { INoteInfo } from '@/app/code/notes/common/notes';

export interface ISessionInfoRequestAttributes {
  readonly sessionId: Session.SessionId;
}

export interface ISessionInfoRequestResponse {
  readonly session_id: Session.SessionId;
  readonly email: Session.UserEmail;
  readonly user: Session.UserName;
  readonly notes: INoteInfo[];
}

export class SessionInfoRequest extends HTTPRequest<ISessionInfoRequestAttributes, ISessionInfoRequestResponse, ISessionInfoRequestResponse> {
  public static readonly staticId = 'session-info';

  protected readonly endpoint: string = ENDPOINTS.SESSION_INFO;
  public readonly id: string = SessionInfoRequest.staticId;

  constructor() {
    super();
  }

  public async handle(): Promise<ResponseInstance<ISessionInfoRequestResponse, ISessionInfoRequestResponse>> {
    const response = await this.post(this.endpoint, this.getAttributes());
    return this.doHandle(response);
  }
}
