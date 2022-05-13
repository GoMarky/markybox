import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Session } from '@/code/session/common/session';
import { IEvent } from '@/base/event';
import { Note } from '@/code/notes/common/notes';

export interface IBaseSocketMessagePayload {
  type: SocketCommandType;
  note_nanoid?: Note.NoteId;
  user_name?: Session.UserName;
}

export enum EditorActionType {
  PasteText = 'pt',
  EnterSymbol = 'es',
  DeleteSymbol = 'ds',
  ChangePosition = 'cn',
}

export interface ISocketEditorActionPayload {
  type: EditorActionType;
  position: string; // '1,2' 'row, column'
}

export enum SocketCommandType {
  EditorAction = 'editor-action',
  Info = 'info',
  Ping = 'ping',
  RoomCreated = 'create_room',
  EnterRoom = 'enter_room',
  LeaveRoom = 'leave_room',
}

export interface ISocketMessageResponse {
  type: SocketCommandType;
  data: any;
}

export interface ISocketService {
  readonly onMessage: IEvent<ISocketMessageResponse>;

  createOrEnterRoom(noteId: Note.NoteId): void;

  connect(): Promise<void>;

  send(payload: unknown & IBaseSocketMessagePayload): void;

  disconnect(): void;
}

export const ISocketService = createDecorator<ISocketService>('socketService');
