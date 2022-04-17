import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { INoteService, Note } from '@/code/notes/common/notes';
import { INoteCreateRequestAttributes, INoteCreateRequestResponse, NoteCreateRequest } from '@/code/request/note-create/note-create-request';
import { IRequestService } from '@/platform/request/common/requestService';
import { INoteUpdateRequestAttributes, INoteUpdateRequestResponse, NoteUpdateRequest } from '@/code/request/note-update/note-update-request';
import { INoteDeleteRequestAttributes, INoteDeleteRequestResponse, NoteDeleteRequest } from '@/code/request/note-delete/note-delete-request';

export class NoteService extends Disposable implements INoteService {
  constructor(
    @IRequestService private readonly requestService: IRequestService
  ) {
    super();
  }

  public async createNote(title?: string): Promise<Note.NoteId> {
    const { data } = await this.requestService.call<INoteCreateRequestAttributes,
      INoteCreateRequestResponse,
      INoteCreateRequestResponse>(NoteCreateRequest.staticId, { title });

    const { id } = data;

    return id;
  }

  public async deleteNote(noteId: Note.NoteId): Promise<void> {
    await this.requestService.call<INoteDeleteRequestAttributes,
      INoteDeleteRequestResponse,
      INoteDeleteRequestResponse>(NoteDeleteRequest.staticId, { noteId })
  }

  public async updateNote(noteId: Note.NoteId, data: Note.NoteId): Promise<void> {
    await this.requestService.call<INoteUpdateRequestAttributes,
      INoteUpdateRequestResponse,
      INoteUpdateRequestResponse>(NoteUpdateRequest.staticId, { noteId, data })
  }
}
