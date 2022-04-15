import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { INoteCreateRequestResponse } from '@/code/request/note-create/note-create-request';

export namespace Note {
  export type NoteId = string;
  export type NoteContent = string;
}

export interface INoteInfo {
  id: Note.NoteId;
  title: string;
  createdAt: number;
  updatedAt: number;
  data: Note.NoteContent;
}

export interface INoteService {
  createNote(): Promise<Note.NoteId>;

  deleteNote(noteId: Note.NoteId): Promise<void>;

  updateNote(noteId: Note.NoteId, data: Note.NoteContent): Promise<void>;
}

export const INoteService = createDecorator<INoteService>('noteService');
