import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IRequestService } from '@/platform/request/common/requestService';
import { ISessionService, Session, UserProfile } from '@/code/session/common/session';
import { ISessionInfoRequestAttributes, ISessionInfoRequestResponse, SessionInfoRequest } from '@/code/request/session-info/session-info-request';
import { getLocalStorageItem, setLocalStorageItem } from '@/base/dom';
import { ISessionLoginRequestAttributes, SessionLoginRequest } from '@/code/request/session-login/session-login-request';
import { Emitter, IEvent } from '@/base/event';

export class SessionService extends Disposable implements ISessionService {
  private readonly _onDidUserLogin: Emitter<void> = new Emitter<void>();
  public readonly onDidUserLogin: IEvent<void> = this._onDidUserLogin.event;

  public readonly profile: UserProfile;

  constructor(
    @IRequestService private readonly requestService: IRequestService,
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

  private async doLogin(session: ISessionInfoRequestResponse): Promise<void> {
    const { user, email, notes, session_id } = session;

    this.profile.sessionId.value = session_id;
    this.profile.notes.value = notes;
    this.profile.name.value = user;
    this.profile.email.value = email;

    setLocalStorageItem('sessionId', session_id);

    this._onDidUserLogin.fire();
  }
}
