import { MObject } from '@/core/objects/MObject';
import { MHTMLRenderer } from '@/core';

export abstract class MHTMLEditorState extends MObject {
  protected constructor(protected readonly renderer: MHTMLRenderer) {
    super();
  }

  public abstract onInput(letter: string): void;

  public abstract onClick(): void;
}

export class MHTMLEditorActiveState extends MHTMLEditorState {
  constructor(renderer: MHTMLRenderer) {
    super(renderer);
  }

  public onInput(letter: string): void {}

  public onClick(): void {}
}

export class MHTMLEditorLockedState extends MHTMLEditorState {
  constructor(renderer: MHTMLRenderer) {
    super(renderer);
  }

  public onInput(letter: string): void {}

  public onClick(): void {}
}
