import { BaseObject } from '@/core/objects/BaseObject';
import { EditorGlobalContext } from '@/core/renderer/html/system/EditorGlobalContext';

export abstract class AbstractEditorState extends BaseObject {
  protected constructor(protected readonly context: EditorGlobalContext) {
    super();
  }

  public abstract onInput(letter: string): void;

  public abstract onClick(event: MouseEvent): void;

  public abstract onDoubleClick(event: MouseEvent): void;

  public abstract onKeyUp(event: KeyboardEvent): void;

  public abstract onKeyDown(event: KeyboardEvent): void;

  public abstract onSelectionStart(event: MouseEvent): void;

  public abstract onSelectionEnd(_: MouseEvent): void;

  public abstract onSelectionMove(event: MouseEvent): void
}


