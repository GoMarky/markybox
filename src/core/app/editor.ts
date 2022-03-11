import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer } from '@/core/renderer/renderer';
import { ILogger } from '@/core/renderer/common';

export interface IEditorOptions {
  readonly renderer: IAbstractRenderer;
  readonly logger?: ILogger;
  readonly fullscreen: boolean;
}

export class MEditor extends MObject {
  private readonly renderer: IAbstractRenderer;
  private readonly logger: ILogger | undefined;

  constructor(options: IEditorOptions) {
    super();

    const { renderer, fullscreen, logger } = options;
    this.renderer = renderer;
    this.logger = logger;

    if (fullscreen) {
      this.renderer.display.setFullScreen();
    }

    console.log(1);

    this.renderer.init();
  }

  public lock(): void {
    this.logger?.warn(`markybox locked`);

    this.renderer.lock();
  }

  public unlock(): void {
    this.renderer.unlock();
  }
}
