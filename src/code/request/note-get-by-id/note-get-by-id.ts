import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { ISessionService, Session } from '@/code/session/common/session';
import { INoteInfo, Note } from '@/code/notes/common/notes';

export interface INoteGetByIdRequestAttributes {
  readonly sessionId?: Session.SessionId;
  readonly noteId: Note.NoteId;
}

export type INoteGetByIdRequestResponse = {
  readonly note: INoteInfo;
};

export class NoteGetByIdRequest extends HTTPRequest<INoteGetByIdRequestAttributes, INoteGetByIdRequestResponse, INoteGetByIdRequestResponse> {
  public static readonly staticId = 'note-get-by-id';

  protected readonly endpoint: string = ENDPOINTS.NOTE_GET_BY_ID;
  public readonly id = NoteGetByIdRequest.staticId;

  constructor(@ISessionService private readonly sessionService: ISessionService) {
    super();
  }

  public async handle(): Promise<ResponseInstance<INoteGetByIdRequestResponse, INoteGetByIdRequestResponse>> {
    const { profile } = this.sessionService;

    const response = await this.post(this.endpoint, {
      sessionId: profile.sessionId.value,
      ...this.getAttributes(),
    });
    return this.doHandle(response);
  }
}
