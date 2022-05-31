import * as markybox from '@/core';
import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { UserNotesStore } from '@/code/notes/browser/note-service';

export namespace Note {
  export type NoteId = string;
  export type NoteContent = string;
  export type NoteLang = markybox.EditorLang;
}

export interface INoteInfo {
  id: Note.NoteId;
  title: string;
  createdAt: number;
  updatedAt: number;
  lang: Note.NoteLang;
  data: Note.NoteContent;
}

export interface INoteService {
  readonly store: UserNotesStore;

  createNoteAfterLogin: boolean;

  getNoteById(noteId: Note.NoteId): Promise<INoteInfo>;

  createNote(title?: string): Promise<Note.NoteId>;

  deleteNote(noteId: Note.NoteId): Promise<void>;

  updateNote(noteId: Note.NoteId, data: Note.NoteContent, lang?: Note.NoteLang): Promise<void>;
}

export const INoteService = createDecorator<INoteService>('noteService');
