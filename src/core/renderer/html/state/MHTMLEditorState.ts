import { MObject } from '@/core/objects/MObject';
import { MHTMLRenderer } from '@/core';
import { isUndefinedOrNull } from '@/base/types';
import { CriticalError } from '@/base/errors';
import { MHTMLEditorBodyNavigator } from '@/core/renderer/html/editor/MHTMLEditorBodyNavigator';
import { MHTMLEditorController } from '@/core/renderer/html/editor/MHTMLEditorController';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLDisplayRenderer } from '@/core/renderer/html/system/MHTMLDisplayRenderer';
import { MHTMLEditorSelection } from '@/core/renderer/html/editor/MHTMLEditorSelection';
import { MHTMLStorage } from '@/core/renderer/html/system/MHTMLStorage';

export interface IEditorStateContext {
  navigator: MHTMLEditorBodyNavigator;
  controller: MHTMLEditorController;
  body: MHTMLEditorBody;
  display: MHTMLDisplayRenderer;
  selection: MHTMLEditorSelection;
  storage: MHTMLStorage;
}

export abstract class MHTMLEditorState extends MObject {
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


