import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import * as string from '@/base/string';

export enum ParenType {
  Unknown,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,
  OpenParenthesis,
  CloseParenthesis,
  Colon,
}

function getParenType(char: MChar): ParenType {
  switch (true) {
    case string.isOpenBrace(char):
      return ParenType.OpenBrace;
    case string.isCloseBrace(char):
      return ParenType.CloseBrace
    case string.isOpenBracket(char):
      return ParenType.OpenBracket;
    case string.isCloseBracket(char):
      return ParenType.CloseBracket
    case string.isOpenParenthesis(char):
      return ParenType.OpenParenthesis
    case string.isCloseParenthesis(char):
      return ParenType.CloseParenthesis
    case string.isColon(char):
      return ParenType.Colon;
    default:
      return ParenType.Unknown
  }
}

export class MHTMLGlyphParen extends MHTMLGlyphDOM<HTMLSpanElement> {
  public readonly type: ParenType;

  constructor(public readonly char: MChar) {
    super();

    this.type = getParenType(char)

    this._el = document.createElement('span');
    this._el.classList.add(`m-editor__paren-${this.type}`)
    this._el.textContent = this.char;
  }

  public dispose(): void {
    super.dispose();

    this.disposables.clear();
    this._el.remove();
  }
}
