import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import {
  IEnvironmentService,
} from '@/platform/environment/common/environment';

import { ILogService } from '@/platform/log/common/log';
import { ILifecycleService, LifePhase } from '@/platform/lifecycle/browser/lifecycle';


export interface IEnvironmentConfig {
  readonly version: string;
  readonly development: boolean;
}

export class EnvironmentService extends Disposable implements IEnvironmentService {
  constructor(
    private readonly config: IEnvironmentConfig,
    @ILogService private readonly logService: ILogService,
    @ILifecycleService private readonly lifecycleService: ILifecycleService
  ) {
    super();
  }

  public get version(): string {
    return this.config.version;
  }

  public get isDev(): boolean {
    return this.config.development;
  }
}
