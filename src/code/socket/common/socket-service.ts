import { createDecorator } from '@/platform/instantiation/common/instantiation';

export interface ISocketService {
  connect(): Promise<void>;

  send(): void;

  disconnect(): void;
}

export const ISocketService = createDecorator<ISocketService>('socketService');
