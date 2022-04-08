import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IRequestService } from '@/platform/request/common/requestService';
import { ISessionService, Session, UserProfile } from '@/code/session/common/session';
import { ISessionInfoRequestAttributes, ISessionInfoRequestResponse, SessionInfoRequest } from '@/code/request/session-info/session-info-request';
import { getLocalStorageItem, setLocalStorageItem } from '@/base/dom';
import { ISessionLoginRequestAttributes, SessionLoginRequest } from '@/code/request/session-login/session-login-request';
import { IBaseSocketMessagePayload, ISocketService } from '@/code/socket/common/socket-service';

export class SessionService extends Disposable implements ISessionService {
  public readonly profile: UserProfile;

  constructor(
    @IRequestService private readonly requestService: IRequestService,
    @ISocketService private readonly socketService: ISocketService,
  ) {
    super();

    this.profile = new UserProfile();
  }

  public async restoreSession(): Promise<void> {
    const sessionId = getLocalStorageItem<Session.SessionId>('sessionId', '');

    if (!sessionId) {
      return;
    }

    const { data } = await this.requestService.call<ISessionInfoRequestAttributes,
      ISessionInfoRequestResponse,
      ISessionInfoRequestResponse>
    (SessionInfoRequest.staticId, { sessionId });

    return this.doLogin(data);
  }

  public async login(email: Session.UserEmail, password: Session.UserPassword): Promise<void> {
    const { data } = await this.requestService.call<ISessionLoginRequestAttributes,
      ISessionInfoRequestResponse,
      ISessionInfoRequestResponse>
    (SessionLoginRequest.staticId, { email, password });

    return this.doLogin(data);
  }

  public async logout(): Promise<void> {
    this.clearSessionData();
  }

  private clearSessionData(): void {
    this.profile.dispose();
    setLocalStorageItem('sessionId', '');
  }

  private doLogin(session: ISessionInfoRequestResponse): void {
    const { user, email, notes, session_id } = session;

    this.profile.sessionId.value = session_id;
    this.profile.notes.value = notes;
    this.profile.name.value = user;
    this.profile.email.value = email;

    const basePayload: IBaseSocketMessagePayload = {
      note_nanoid: '5f5f54rd-566uhmfgfd-3dasd3-dq2asd',
      user_name: user,
    }

    void this.socketService.connect()
      .then(() => this.socketService.send(basePayload))
  }
}
