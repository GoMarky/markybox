import { BaseObject } from '@/core/objects/BaseObject';
import { HTMLRenderer } from '@/core';
import { isUndefinedOrNull } from '@/base/types';
import { CriticalError } from '@/base/errors';
import { EditorBodyNavigator } from '@/core/renderer/html/editor/EditorBodyNavigator';
import { EditorRowsController } from '@/core/renderer/html/editor/EditorRowsController';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/EditorBodyContainer';
import { EditorDisplayController } from '@/core/renderer/html/system/EditorDisplayController';
import { EditorSelectionContainer } from '@/core/renderer/html/editor/EditorSelectionContainer';
import { EditorStorage } from '@/core/renderer/html/system/EditorStorage';

export interface IEditorStateContext {
  navigator: EditorBodyNavigator;
  controller: EditorRowsController;
  body: MHTMLEditorBody;
  display: EditorDisplayController;
  selection: EditorSelectionContainer;
  storage: EditorStorage;
}

export abstract class AbstractEditorState extends BaseObject {
  protected context: IEditorStateContext;

  protected constructor() {
    super();
  }

  public abstract onInput(letter: string): void;

  public abstract onClick(event: MouseEvent): void;

  public abstract onKeyDown(event: KeyboardEvent): void;

  public abstract onSelectionStart(event: MouseEvent): void

  public abstract onSelectionEnd(_: MouseEvent): void;

  public abstract onSelectionMove(event: MouseEvent): void

  public setContext(context: IEditorStateContext): void {
    const { navigator, controller, body } = context;

    this.context = context;

    body.formatter.setContext(navigator, controller)
  }
}


