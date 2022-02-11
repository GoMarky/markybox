import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { ILogService } from '@/platform/log/common/log';
import { createDecorator } from '@/platform/instantiation/common/instantiation';

import { Barrier } from '@/base/async';
import { ApplicationError } from '@/base/errors';

export enum LifePhase {
  // Состояния приложения по умолчанию, при старте
  Starting = 1,
  // Приложение готово к работе, и идет запуск основного view.
  Ready = 2,
  // Активация сервисов которые создаются по требованию.
  Eventually = 3,
  // Приложение начало работу в нормальном режиме. (Созданы вьюхи)
  Started = 4,
}

export interface ILifecycleService {
  phase: LifePhase;

  when(phase: LifePhase): Promise<void>;
}

export const ILifecycleService = createDecorator<ILifecycleService>('lifecycleService');

export class LifecycleError extends ApplicationError {
  public readonly name = 'LifecycleError';

  constructor(message: string, public readonly lifePhase: LifePhase) {
    super(message);
  }
}

export class LifecycleService extends Disposable implements ILifecycleService {
  private readonly phaseWhen = new Map<LifePhase, Barrier>();
  private _phase: LifePhase = LifePhase.Starting;

  public readonly serviceBrand: ILifecycleService;

  constructor(@ILogService protected readonly logService: ILogService) {
    super();
  }

  public get phase(): LifePhase {
    return this._phase;
  }

  public set phase(value: LifePhase) {
    if (value < this.phase) {
      throw new LifecycleError('Lifecycle cannot go backwards', this._phase);
    }

    if (this._phase === value) {
      return;
    }

    this.logService.trace(`lifecycle: phase changed (value: ${LifePhase[value]})`);

    this._phase = value;

    const barrier = this.phaseWhen.get(this._phase);

    if (barrier) {
      barrier.open();
      this.phaseWhen.delete(this._phase);
    }
  }

  public async when(phase: LifePhase): Promise<void> {
    if (phase <= this._phase) {
      return;
    }

    let barrier = this.phaseWhen.get(phase);

    if (!barrier) {
      barrier = new Barrier();
      this.phaseWhen.set(phase, barrier);
    }

    await barrier.wait();
  }
}
