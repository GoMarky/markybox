import { Disposable } from '@/app/platform/lifecycle/common/lifecycle';
import { Emitter, IEvent } from '@/base/event';
import { CriticalError } from '@/base/errors';
import { isUndefinedOrNull } from '@/base/types';

export enum LogLevel {
  Trace,
  Debug,
  Info,
  Warning,
  Error,
  Critical,
  Off,
}

export abstract class AbstractLogService extends Disposable {
  private level: LogLevel = LogLevel.Info;

  private readonly _onDidChangeLogLevel: Emitter<LogLevel> = new Emitter<LogLevel>();
  public readonly onDidChangeLogLevel: IEvent<LogLevel> = this._onDidChangeLogLevel.event;

  public setLevel(level: LogLevel): void {
    if (isUndefinedOrNull(level)) {
      throw new CriticalError(`AbstractLogService#setLevel - no log level provided`);
    }

    if (this.level !== level) {
      this.level = level;

      this._onDidChangeLogLevel.fire(this.level);
    }
  }

  public getLevel(): LogLevel {
    return this.level;
  }
}
