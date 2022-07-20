import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { Emitter, IEvent } from '@/base/event';
import { CriticalError } from '@/base/errors';
import { isUndefinedOrNull } from '@/base/types';

export class SocketConnection<TMessage, TResponse> extends Disposable {
  private ws: WebSocket | null = null;

  private readonly _onMessage: Emitter<TResponse> = new Emitter<TResponse>();
  public readonly onMessage: IEvent<TResponse> = this._onMessage.event;

  constructor(
    private readonly socketURL: string,
  ) {
    super();
  }

  public get active(): boolean {
    return !isUndefinedOrNull(this.ws);
  }

  private onError(_: unknown): void {
    //
  }

  private onClose(error: unknown): void {
    console.log(error);
  }

  private _send(payload: Record<string, any> & TMessage): void {
    try {
      this.ws?.send(JSON.stringify(payload));
    } catch (error) {
      this.onError(error);
    }
  }

  public send(payload: Record<string, any> & TMessage): void {
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
    if (this.active) {
      throw new CriticalError(`Cant create connection, when already connected`);
    }

    const ws = this.ws = new WebSocket(this.socketURL);

    const onMessage = (event: MessageEvent) => {
      const { data } = event;
      const response = JSON.parse(data) as TResponse;

      this._onMessage.fire(response);
    };

    ws.addEventListener('message', onMessage);

    ws.addEventListener('close', this.onClose.bind(this));

    return new Promise((resolve) => {
      ws.addEventListener('open', () => resolve());
    })
  }

  public disconnect(): void {
    this.ws?.close(1000, 'Client closed connection');
    this.ws = null;
  }
}
