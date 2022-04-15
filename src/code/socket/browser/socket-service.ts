import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IBaseSocketMessagePayload, ISocketMessageResponse, ISocketService, SocketCommandType } from '@/code/socket/common/socket-service';
import { Emitter, IEvent } from '@/base/event';
import { ISessionService, Session } from '@/code/session/common/session';
import { unref } from 'vue';
import { CriticalError } from '@/base/errors';
import { Note } from '@/code/notes/common/notes';

const SOCKET_URL = 'ws://localhost:3000/v1/subscribe/';

export class SocketService extends Disposable implements ISocketService {
  private ws?: WebSocket;

  private readonly _onMessage: Emitter<ISocketMessageResponse> = new Emitter<ISocketMessageResponse>();
  public readonly onMessage: IEvent<ISocketMessageResponse> = this._onMessage.event;

  constructor(@ISessionService private readonly sessionService: ISessionService) {
    super();
  }

  private _send(payload: unknown & IBaseSocketMessagePayload): void {
    this.ws?.send(JSON.stringify(payload));
  }

  public createOrEnterRoom(noteId: Note.NoteId): void {
    const { email } = this.sessionService.profile;

    // TODO: test
    if (true) {
      return;
    }

    const basePayload: IBaseSocketMessagePayload = {
      type: SocketCommandType.EnterRoom,
      note_nanoid: noteId,
      user_name: unref(email),
    }

    void this.connect()
      .then(() => this.send(basePayload))
  }

  public send(payload: unknown & IBaseSocketMessagePayload): void {
    if (!this.ws) {
      throw new CriticalError(`Cant send message, when no connection exist`);
    }

    if (this.ws.readyState === this.ws.CLOSING || this.ws.readyState === this.ws.CLOSED) {
      throw new CriticalError(`Cant send message when connection - CLOSED`);
    }

    this._send(payload);
  }

  public async connect(): Promise<void> {
    /**
     * Если соединение уже установлено, ничего не делаем
     */
    if (this.ws) {
      throw new CriticalError(`Cant create connection, when already connected`);
    }

    const ws = this.ws = new WebSocket(SOCKET_URL);

    ws.addEventListener('message', (event) => {
      const { data } = event;
      const response = JSON.parse(data) as ISocketMessageResponse;

      this._onMessage.fire(response);
    })

    return new Promise((resolve) => {
      ws.addEventListener('open', () => resolve());
    })
  }

  public disconnect(): void {
    return this.ws?.close(1000, 'Client closed connection')
  }
}
