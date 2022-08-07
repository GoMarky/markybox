import { Disposable } from '@/app/platform/lifecycle/common/lifecycle';
import * as markybox from '@/core';

export class EditorInstance extends Disposable {
  private readonly _renderer: markybox.HTMLRenderer;
  public get renderer(): markybox.HTMLRenderer {
    return this._renderer;
  }

  constructor(
    private readonly name: string,
  ) {
    super();

    this._renderer = new markybox.HTMLRenderer(name);
  }
}
