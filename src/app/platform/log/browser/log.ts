import { AbstractLogService, LogLevel } from '../common/abstractLog';
import { ILogService } from '@/app/platform/log/common/log';
import { isTest } from '@/base/platform';

export class ConsoleLogService extends AbstractLogService implements ILogService {
  constructor(logLevel: LogLevel = LogLevel.Trace) {
    super();

    this.setLevel(logLevel);

    this.onDidChangeLogLevel(level => {
      console.log(`%c INFO`, 'color: #33f', `Log level was change to: ${LogLevel[level]}`);
    });
  }

  public nextTick(message: string, ...args: any[]): void {
    window.setTimeout(() => this.info(message, ...args), 1000);
  }

  public trace(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Trace) {
      console.log('%cTRACE', 'color: #888', message, ...args);
    }
  }

  public debug(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Debug) {
      console.log('%cDEBUG', 'background: #eee; color: #888', message, ...args);
    }
  }

  public info(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Info) {
      console.log('%c INFO', 'color: #33f', message, ...args);
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Warning) {
      console.log('%c WARN', 'color: #993', message, ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Error) {
      console.log('%c  ERR', 'color: #f33', message, ...args);
    }
  }

  public critical(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Critical) {
      console.log('%cCRITI', 'background: #f33; color: white', message, ...args);
    }
  }

  public test(message: string, ...args: any[]): void {
    if (!isTest) {
      return;
    }

    if (this.getLevel() <= LogLevel.Trace) {
      console.log('##TEST##:', message, ...args);
    }
  }
}
