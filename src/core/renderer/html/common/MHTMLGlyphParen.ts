import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';

export class MHTMLGlyphParen extends MHTMLGlyphWord {
  constructor(parent: HTMLElement, text: string) {
    super(parent, text, 'm-editor__plain');
  }
}
