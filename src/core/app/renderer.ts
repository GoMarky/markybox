import { ILogger } from '@/core/app/common';

export interface IRendererDisplay {
  setFullScreen(): void;
}

export interface IAbstractRenderer {
  logger?: ILogger;
  readonly display: IRendererDisplay;

  unlock(): void;
  lock(): void;
  init(logger?: ILogger): void;

  setText(text: string): void;
  getText(): string;
}
