import { BaseObject } from '@/core/objects/BaseObject';
import { EditorTheme } from '@/core';

export class EditorThemeService extends BaseObject {
  private _theme: EditorTheme = 'light';

  constructor() {
    super();
  }
}
