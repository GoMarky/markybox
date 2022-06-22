import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { INoteInfo, INoteService, Note } from '@/code/notes/common/notes';
import { INoteCreateRequestAttributes, INoteCreateRequestResponse, NoteCreateRequest } from '@/code/request/note-create/note-create-request';
import { IRequestService } from '@/platform/request/common/requestService';
import { INoteUpdateRequestAttributes, INoteUpdateRequestResponse, NoteUpdateRequest } from '@/code/request/note-update/note-update-request';
import { INoteDeleteRequestAttributes, INoteDeleteRequestResponse, NoteDeleteRequest } from '@/code/request/note-delete/note-delete-request';
import { ISessionService } from '@/code/session/common/session';
import { INoteGetAllRequestAttributes, INoteGetAllRequestResponse, NoteGetAllRequest } from '@/code/request/note-get-all/note-get-all';
import { INoteGetByIdRequestAttributes, INoteGetByIdRequestResponse, NoteGetByIdRequest } from '@/code/request/note-get-by-id/note-get-by-id';
import { ref, Ref } from 'vue';

export class UserNotesStore extends Disposable {
  public readonly currentNote: Ref<INoteInfo | null> = ref(null);

  constructor() {
    super();
  }

  public dispose(): void {
    this.currentNote.value = null;
  }
}

export class NoteService extends Disposable implements INoteService {
  public createNoteAfterLogin: boolean = false;

  public readonly store: UserNotesStore = new UserNotesStore();

  constructor(
    @IRequestService private readonly requestService: IRequestService,
    @ISessionService private readonly sessionService: ISessionService,
  ) {
    super();

    this.registerListeners();
  }

  public async createNote(title: string = ''): Promise<Note.NoteId> {
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

  public async updateNote(noteId: Note.NoteId, data: Note.NoteId, lang?: Note.NoteLang): Promise<void> {
    await this.requestService.call<INoteUpdateRequestAttributes,
      INoteUpdateRequestResponse,
      INoteUpdateRequestResponse>(NoteUpdateRequest.staticId, { noteId, data, lang })
  }

  public async getNoteById(noteId: Note.NoteId): Promise<INoteInfo> {
    const { data } = await this.requestService.call<INoteGetByIdRequestAttributes,
      INoteGetByIdRequestResponse,
      INoteGetByIdRequestResponse>(NoteGetByIdRequest.staticId, { noteId })

    return data.note;
  }

  private async getNotes(): Promise<INoteInfo[]> {
    const { data } = await this.requestService.call<INoteGetAllRequestAttributes,
      INoteGetAllRequestResponse,
      INoteGetAllRequestResponse>(NoteGetAllRequest.staticId)

    return data.notes;
  }

  private registerListeners(): void {
    const { profile } = this.sessionService;

    const onUserLogin = async () => {
      try {
        profile.notes.value = await this.getNotes();

      } catch (error) {
        console.warn(error);
      }
    }

    this.sessionService.onDidUserLogin(onUserLogin)
  }
}
