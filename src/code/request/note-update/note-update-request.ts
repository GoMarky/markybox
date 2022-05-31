import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { ISessionService, Session } from '@/code/session/common/session';
import { INoteInfo, Note } from '@/code/notes/common/notes';

export interface INoteUpdateRequestAttributes {
  readonly sessionId?: Session.SessionId;
  readonly noteId: Note.NoteId;
  readonly lang?: Note.NoteLang;
  readonly data: Note.NoteContent;
}

export type INoteUpdateRequestResponse = 'updated';

export class NoteUpdateRequest extends HTTPRequest<INoteUpdateRequestAttributes, INoteUpdateRequestResponse, INoteUpdateRequestResponse> {
  public static readonly staticId = 'note-update';

  protected readonly endpoint: string = ENDPOINTS.NOTE_UPDATE;
  public readonly id: string = NoteUpdateRequest.staticId;

  constructor(@ISessionService private readonly sessionService: ISessionService) {
    super();
  }

  public async handle(): Promise<ResponseInstance<INoteUpdateRequestResponse, INoteUpdateRequestResponse>> {
    const { profile } = this.sessionService;

    const response = await this.patch(this.endpoint, {
      sessionId: profile.sessionId.value,
      ...this.getAttributes(),
    });
    return this.doHandle(response);
  }
}
