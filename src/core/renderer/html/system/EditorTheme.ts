import { BaseObject } from '@/core/objects/BaseObject';
import { EditorTheme } from '@/core';

export class EditorThemeService extends BaseObject {
  private _theme: EditorTheme = 'light';

  constructor() {
    super();
  }

  public get theme(): EditorTheme {
    return this._theme;
  }

  public setTheme(theme: EditorTheme): void {
    console.log(theme);

    this._theme = theme;
  }
}
