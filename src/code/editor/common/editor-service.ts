import { createDecorator } from '@/platform/instantiation/common/instantiation';
import * as markybox from '@/core';
import { Note } from '@/code/notes/common/notes';

export interface IEditorService {
  readonly editor: markybox.MEditor;
  readonly renderer: markybox.HTMLRenderer;

  create(noteId: Note.NoteId): Promise<void>;
}

export const IEditorService = createDecorator<IEditorService>('editorService');
