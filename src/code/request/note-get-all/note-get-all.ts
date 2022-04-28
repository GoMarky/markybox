import { ENDPOINTS } from '@/platform/request/browser/requests';
import { HTTPRequest, ResponseInstance } from '@/code/request/baseRequest';
import { ISessionService, Session } from '@/code/session/common/session';
import { INoteInfo } from '@/code/notes/common/notes';

export interface INoteGetAllRequestAttributes {
  readonly sessionId?: Session.SessionId;
}

export type INoteGetAllRequestResponse = {
  readonly notes: INoteInfo[];
};

export class NoteGetAllRequest extends HTTPRequest<INoteGetAllRequestAttributes, INoteGetAllRequestResponse, INoteGetAllRequestResponse> {
  public static readonly staticId = 'note-get-all';

  protected readonly endpoint: string = ENDPOINTS.NOTE_GET_ALL;
  public readonly id = NoteGetAllRequest.staticId;

  constructor(@ISessionService private readonly sessionService: ISessionService) {
    super();
  }

  public async handle(): Promise<ResponseInstance<INoteGetAllRequestResponse, INoteGetAllRequestResponse>> {
    const { profile } = this.sessionService;

    const response = await this.post(this.endpoint, {
      sessionId: profile.sessionId.value,
      ...this.getAttributes(),
    });
    return this.doHandle(response);
  }
}
