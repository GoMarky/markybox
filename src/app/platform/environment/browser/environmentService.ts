import { Disposable } from '@/app/platform/lifecycle/common/lifecycle';
import {
  IEnvironmentService,
} from '@/app/platform/environment/common/environment';

export interface IEnvironmentConfig {
  readonly version: string;
}

export class EnvironmentService extends Disposable implements IEnvironmentService {
  constructor(
    private readonly config: IEnvironmentConfig,
  ) {
    super();
  }

  public get version(): string {
    return this.config.version;
  }
}
