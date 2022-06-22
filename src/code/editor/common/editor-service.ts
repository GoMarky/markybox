import { createDecorator } from '@/platform/instantiation/common/instantiation';
import * as markybox from '@/core';
import { INoteInfo, Note } from '@/code/notes/common/notes';

export interface IEditorService {
  readonly editor: markybox.MEditor;
  readonly renderer: markybox.HTMLRenderer;

  create(note: INoteInfo): Promise<void>;
  loadNote(noteId: Note.NoteId): Promise<INoteInfo>;
}

export const IEditorService = createDecorator<IEditorService>('editorService');
