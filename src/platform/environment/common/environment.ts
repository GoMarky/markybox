import { createDecorator } from '@/platform/instantiation/common/instantiation';

export const IEnvironmentService = createDecorator<IEnvironmentService>('environmentService');

export interface IEnvironmentService {
  readonly version: string;
  readonly isDev: boolean;
}
