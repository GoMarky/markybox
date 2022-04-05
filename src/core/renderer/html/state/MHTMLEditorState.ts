import { MObject } from '@/core/objects/MObject';
import { MHTMLRenderer } from '@/core';
import { isUndefinedOrNull } from '@/base/types';
import { CriticalError } from '@/base/errors';

export abstract class MHTMLEditorState extends MObject {
  protected renderer: MHTMLRenderer

  protected constructor() {
    super();
  }

  public abstract onInput(letter: string): void;

  public abstract onClick(event: MouseEvent): void;

  public abstract onKeyDown(event: KeyboardEvent): void;

  public abstract onSelectionStart(event: MouseEvent): void

  public abstract onSelectionEnd(_: MouseEvent): void;

  public abstract onSelectionMove(event: MouseEvent): void

  public setContext(renderer: MHTMLRenderer): void {
    if (isUndefinedOrNull(renderer)) {
      throw new CriticalError(`Context for state must exist. Got - ${renderer}`);
    }

    this.renderer = renderer;
  }
}


