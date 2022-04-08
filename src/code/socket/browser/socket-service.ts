import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { ISocketService } from '@/code/socket/common/socket-service';
import { Emitter, IEvent } from '@/base/event';

const SOCKET_URL = 'ws://localhost:3000/v1/subscribe/';

export class SocketService extends Disposable implements ISocketService {
  private ws?: WebSocket;

  private readonly _onMessage: Emitter<void> = new Emitter<void>();
  public readonly onMessage: IEvent<void> = this._onMessage.event;

  constructor() {
    super();
  }

  private _send(): void {
    this.ws?.send(JSON.stringify({ type: 'setup' }));
  }

  public send(): void {
    if (!this.ws) {
      return;
    }

    this._send();
  }

  public async connect(): Promise<void> {
    /**
     * Если соединение уже установлено, ничего не делаем
     */
    if (this.ws) {
      return;
    }

    const ws = this.ws = new WebSocket(SOCKET_URL);

    return new Promise((resolve) => {
      ws.addEventListener('open', () => resolve());
    })
  }

  public disconnect(): void {
    this.ws?.close();
  }
}
