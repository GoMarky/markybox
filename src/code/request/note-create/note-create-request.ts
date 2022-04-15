import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { Session } from '@/code/session/common/session';
import { Note } from '@/code/notes/common/notes';

export interface INoteCreateRequestAttributes {
  readonly sessionId: Session.SessionId;
  readonly noteId: Note.NoteId;
  readonly data: Note.NoteContent;
}

export type INoteCreateRequestResponse = 'created';

export class NoteCreateRequest extends HTTPRequest<INoteCreateRequestAttributes, INoteCreateRequestResponse, INoteCreateRequestResponse> {
  public static readonly staticId = 'note-create';

  protected readonly endpoint: string = ENDPOINTS.NOTE_CREATE;
  public readonly id: string = NoteCreateRequest.staticId;

  constructor() {
    super();
  }

  public async handle(): Promise<ResponseInstance<INoteCreateRequestResponse, INoteCreateRequestResponse>> {
    const response = await this.post(this.endpoint, this.getAttributes());
    return this.doHandle(response);
  }
}
