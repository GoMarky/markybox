import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';
import { MChar } from '@/core/renderer/html/editor/MHTMLEditorBodyTextarea';
import { isCloseBrace, isCloseBracket, isCloseParenthesis, isOpenBrace, isOpenBracket, isOpenParenthesis } from '@/base/string';

export enum ParenType {
  Unknown ,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,
  OpenParenthesis,
  CloseParenthesis
}

function getParenType(char: MChar): ParenType {
  switch (true) {
    case isOpenBrace(char):
      return ParenType.OpenBrace;
    case isCloseBrace(char):
      return ParenType.CloseBrace
    case isOpenBracket(char):
      return ParenType.OpenBracket;
    case isCloseBracket(char):
      return ParenType.CloseBracket
    case isOpenParenthesis(char):
      return ParenType.OpenParenthesis
    case isCloseParenthesis(char):
      return ParenType.CloseParenthesis
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
