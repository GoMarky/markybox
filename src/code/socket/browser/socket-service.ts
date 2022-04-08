import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IBaseSocketMessagePayload, ISocketMessageResponse, ISocketService } from '@/code/socket/common/socket-service';
import { Emitter, IEvent } from '@/base/event';

const SOCKET_URL = 'ws://localhost:3000/v1/subscribe/';

export class SocketService extends Disposable implements ISocketService {
  private ws?: WebSocket;

  private readonly _onMessage: Emitter<ISocketMessageResponse> = new Emitter<ISocketMessageResponse>();
  public readonly onMessage: IEvent<ISocketMessageResponse> = this._onMessage.event;

  constructor() {
    super();
  }

  private _send(payload: unknown & IBaseSocketMessagePayload): void {
    this.ws?.send(JSON.stringify(payload));
  }

  public send(payload: unknown & IBaseSocketMessagePayload): void {
    if (!this.ws) {
      return;
    }

    this._send(payload);
  }

  public async connect(): Promise<void> {
    /**
     * Если соединение уже установлено, ничего не делаем
     */
    if (this.ws) {
      return;
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
    this.ws?.close();
  }
}
