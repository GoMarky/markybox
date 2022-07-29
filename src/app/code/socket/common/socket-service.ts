import { Session } from '@/app/code/session/common/session';
import { Note } from '@/app/code/notes/common/notes';

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

export enum SocketCommandType {
  EditorAction = 'editor_action',
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
