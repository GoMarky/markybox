import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IRequestService } from '@/platform/request/common/requestService';
import { ISessionService, Session, UserProfile } from '@/code/session/common/session';

export class SessionService extends Disposable implements ISessionService {
  public readonly profile: UserProfile;

  constructor(
    @IRequestService private readonly RequestService: IRequestService,
  ) {
    super();

    this.profile = new UserProfile();
  }

  public async restoreSession(): Promise<void> {

  }

  public async createSession(email: Session.UserEmail, password: Session.UserPassword): Promise<void> {
    console.log(email, password);
  }

  private clearSessionData(): void {

  }

  private doLogin(): void {
    //
  }
}
