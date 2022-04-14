import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Session } from '@/code/session/common/session';
import { IEvent } from '@/base/event';

export interface IBaseSocketMessagePayload {
  type: SocketCommandType;
  note_nanoid?: Session.NoteId;
  user_name?: Session.UserName;
}

export enum SocketCommandType {
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

  createOrEnterRoom(noteId: Session.NoteId): void;

  connect(): Promise<void>;

  send(payload: unknown & IBaseSocketMessagePayload): void;

  disconnect(): void;
}

export const ISocketService = createDecorator<ISocketService>('socketService');
