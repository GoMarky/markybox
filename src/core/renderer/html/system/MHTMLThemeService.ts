import { MObject } from '@/core/objects/MObject';
import { EditorTheme } from '@/core';

export class MHTMLThemeService extends MObject {
  private _theme: EditorTheme = 'light';

  constructor() {
    super();
  }
}
