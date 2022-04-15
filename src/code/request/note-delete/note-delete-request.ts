import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { Session } from '@/code/session/common/session';
import { Note } from '@/code/notes/common/notes';

export interface INoteDeleteRequestAttributes {
  readonly sessionId: Session.SessionId;
  readonly noteId: Note.NoteId;
}

export type INoteDeleteRequestResponse = 'deleted'

export class NoteDeleteRequest extends HTTPRequest<INoteDeleteRequestAttributes, INoteDeleteRequestResponse, INoteDeleteRequestResponse> {
  public static readonly staticId = 'note-delete';

  protected readonly endpoint: string = ENDPOINTS.NOTE_DELETE;
  public readonly id: string = NoteDeleteRequest.staticId;

  constructor() {
    super();
  }

  public async handle(): Promise<ResponseInstance<INoteDeleteRequestResponse, INoteDeleteRequestResponse>> {
    const response = await this.delete(this.endpoint, this.getAttributes());
    return this.doHandle(response);
  }
}
