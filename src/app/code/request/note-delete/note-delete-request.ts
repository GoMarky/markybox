import { ENDPOINTS } from '@/app/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/app/code/request/baseRequest';
import { ISessionService, Session } from '@/app/code/session/common/session';
import { Note } from '@/app/code/notes/common/notes';

export interface INoteDeleteRequestAttributes {
  readonly sessionId?: Session.SessionId;
  readonly noteId: Note.NoteId;
}

export type INoteDeleteRequestResponse = 'deleted'

export class NoteDeleteRequest extends HTTPRequest<INoteDeleteRequestAttributes, INoteDeleteRequestResponse, INoteDeleteRequestResponse> {
  public static readonly staticId = 'note-delete';

  protected readonly endpoint: string = ENDPOINTS.NOTE_DELETE;
  public readonly id: string = NoteDeleteRequest.staticId;

  constructor(@ISessionService private readonly sessionService: ISessionService) {
    super();
  }

  public async handle(): Promise<ResponseInstance<INoteDeleteRequestResponse, INoteDeleteRequestResponse>> {
    const { profile } = this.sessionService;

    const response = await this.delete(this.endpoint, {
      sessionId: profile.sessionId.value,
      ...this.getAttributes(),
    });
    return this.doHandle(response);
  }
}
