import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer } from '@/core/app/renderer';
import { ILogger } from '@/core/app/common';

export interface IEditorOptions {
  readonly renderer: IAbstractRenderer;
  readonly logger?: ILogger;
  readonly fullscreen: boolean;
  readonly initialText?: string;
}

export class MEditor extends MObject {
  private readonly renderer: IAbstractRenderer;
  private readonly logger: ILogger | undefined;

  constructor(options: IEditorOptions) {
    super();

    const { renderer, fullscreen, logger, initialText } = options;
    this.renderer = renderer;
    this.logger = logger;

    if (fullscreen) {
      this.renderer.display.setFullScreen();
    }

    this.renderer.init(initialText);
  }

  public lock(): void {
    this.logger?.warn(`markybox locked`);

    this.renderer.lock();
  }

  public unlock(): void {
    this.renderer.unlock();
  }

  public text(): string {
    return this.renderer.text();
  }
}
