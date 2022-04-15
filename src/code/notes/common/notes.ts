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
