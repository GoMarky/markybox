import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { EditorBodyNavigator } from '@/core/renderer/html/editor/EditorBodyNavigator';
import { EditorRowsController } from '@/core/renderer/html/editor/EditorRowsController';
import { MHTMLEditorBody } from '@/core/renderer/html/editor/EditorBodyContainer';
import { EditorStorage } from '@/core/renderer/html/system/EditorStorage';
import { EditorDisplayController } from '@/core/renderer/html/system/EditorDisplayController';
import { EditorSelectionContainer } from '@/core/renderer/html/editor/EditorSelectionContainer';
import { EditorCommandCenter } from '@/core/renderer/html/system/EditorCommandService';

export class EditorGlobalContext extends Disposable {
  public body: MHTMLEditorBody;
  public command: EditorCommandCenter;

  constructor(
    public readonly navigator: EditorBodyNavigator,
    public readonly controller: EditorRowsController,
    public readonly storage: EditorStorage,
    public readonly display: EditorDisplayController,
    public readonly selection: EditorSelectionContainer,
  ) {
    super();
  }

  public setBody(body: MHTMLEditorBody): void {
    this.body = body;
  }

  public setCommand(command: EditorCommandCenter): void {
    this.command = command;
  }
}
