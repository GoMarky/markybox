import { ENDPOINTS } from '@/app/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/app/code/request/baseRequest';
import { ISessionService, Session } from '@/app/code/session/common/session';
import { Note } from '@/app/code/notes/common/notes';

export interface INoteCreateRequestAttributes {
  readonly sessionId?: Session.SessionId;
  readonly title?: string;
}

export type INoteCreateRequestResponse = {
  readonly id: Note.NoteId
};

export class NoteCreateRequest extends HTTPRequest<INoteCreateRequestAttributes, INoteCreateRequestResponse, INoteCreateRequestResponse> {
  public static readonly staticId = 'note-create';

  protected readonly endpoint: string = ENDPOINTS.NOTE_CREATE;
  public readonly id: string = NoteCreateRequest.staticId;

  constructor(@ISessionService private readonly sessionService: ISessionService) {
    super();
  }

  public async handle(): Promise<ResponseInstance<INoteCreateRequestResponse, INoteCreateRequestResponse>> {
    const { profile } = this.sessionService;

    const attrs = this.getAttributes();

    if (profile.isAuth.value) {
      Reflect.set(attrs, 'sessionId', profile.sessionId.value);
    }

    const response = await this.post(this.endpoint, attrs);
    return this.doHandle(response);
  }
}
