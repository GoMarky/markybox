import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { Session } from '@/code/session/common/session';
import { INoteInfo } from '@/code/notes/common/notes';

export interface ISessionInfoRequestAttributes {
  readonly sessionId: Session.SessionId;
}

export interface ISessionInfoRequestResponse {
  readonly sessionId: Session.SessionId;
  readonly profile: {
    email: Session.UserEmail;
    name: Session.UserName;
  }
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
