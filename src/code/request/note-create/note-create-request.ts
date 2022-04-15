import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { ISessionService, Session } from '@/code/session/common/session';
import { Note } from '@/code/notes/common/notes';

export interface INoteCreateRequestAttributes {
  readonly sessionId?: Session.SessionId;
  readonly data: Note.NoteContent;
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

    const response = await this.post(this.endpoint, {
      sessionId: profile.sessionId.value,
      ...this.getAttributes(),
    });
    return this.doHandle(response);
  }
}
