import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { IEditorService } from '@/code/editor/common/editor-service';
import * as markybox from '@/core';

export class EditorService extends Disposable implements IEditorService {
  private readonly _editor: markybox.MEditor;
  private readonly _renderer: markybox.MHTMLRenderer;

  constructor() {
    super();

    const renderer = this._renderer = new markybox.MHTMLRenderer();
    this._editor = new markybox.MEditor({ renderer });
  }

  public get renderer(): markybox.MHTMLRenderer {
    return this._renderer;
  }

  public get editor(): markybox.MEditor {
    return this._editor;
  }
}
