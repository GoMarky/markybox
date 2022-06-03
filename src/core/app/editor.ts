import { MObject } from '@/core/objects/MObject';
import { IAbstractRenderer } from '@/core/app/renderer';
import { ILogger } from '@/core/app/common';

export interface IEditorOptions {
  readonly renderer: IAbstractRenderer;
  readonly logger?: ILogger;
}

export class MEditor extends MObject {
  private readonly renderer: IAbstractRenderer;
  private readonly logger: ILogger | undefined;

  constructor(options: IEditorOptions) {
    super();

    const { renderer, logger } = options;
    this.renderer = renderer;
    this.logger = logger;
  }

  public lock(): void {
    this.logger?.warn(`markybox locked`);

    this.renderer.lock();
  }

  public unlock(): void {
    this.renderer.unlock();
  }

  public setText(text: string): void {
    this.renderer.setText(text);
  }

  public getText(): string {
    return this.renderer.getText();
  }
}
