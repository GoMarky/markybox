import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { IEvent } from '@/base/event';
import { LogLevel } from '@/platform/log/common/abstractLog';

export function now(): string {
  return new Date().toISOString();
}

export const ILogService = createDecorator<ILogService>('logService');

export interface ILogService {
  readonly onDidChangeLogLevel: IEvent<LogLevel>;

  setLevel(level: LogLevel): void;
  getLevel(): LogLevel;

  trace(message: string, ...args: any[]): void;
  nextTick(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  critical(message: string, ...args: any[]): void;
  test(message: string, ...args: any[]): void;
}
