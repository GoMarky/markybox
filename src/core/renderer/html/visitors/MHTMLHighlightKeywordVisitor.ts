import { MObject } from '@/core/objects/MObject';
import { IVisitor } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLGlyphWord } from '@/core/renderer/html/common/MHTMLGlyphWord';
import { JavascriptCodeFormatter, StatementClassName } from '@/core/formatters/javascript/javascript-formatter';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { MHTMLRenderer } from '@/core';

function getClassNameByStatement(statement?: CodeStatement): StatementClassName | undefined {
  if (!statement) {
    return undefined;
  }

  switch (statement) {
    case CodeStatement.VariableDeclaration:
    default:
      return 'm-editor__keyword-identifier';
  }
}

export class MHTMLHighlightKeywordVisitor extends MObject implements IVisitor {
  constructor(
    private readonly renderer: MHTMLRenderer,
  ) {
    super();
  }

  public visit(fragment: MHTMLNodeFragment): void {
    const { children } = fragment;

    const glyphs = children.filter((glyph) => glyph instanceof MHTMLGlyphWord) as MHTMLGlyphWord[];

    for (const [index, glyph] of glyphs.entries()) {
      this.checkStatement(glyph);

      const previousGlyph = glyphs[index - 1];
      this.checkStatementName(glyph, previousGlyph);
      this.checkIsString(glyph);
      this.checkParentheses();
    }
  }

  private checkParentheses(): void {
  }

  private checkIsString(word: MHTMLGlyphWord): void {
    const { text } = word;

    if (text.startsWith('\'') && text.endsWith('\'')) {
      this.doAddClassName(word, 'm-editor__keyword-identifier-string');
    }
  }

  private checkStatementName(current: MHTMLGlyphWord, previous?: MHTMLGlyphWord): void {
    if (!previous) {
      return;
    }

    const { formatter } = this.renderer.body;

    if (formatter.parseKeyword(previous.text)) {
      this.doAddClassName(current, 'm-editor__keyword-identifier-name');
    }
  }

  private checkStatement(glyph: MHTMLGlyphWord): void {
    const { formatter } = this.renderer.body;

    const statement = formatter.parseKeyword(glyph.text);
    const className = getClassNameByStatement(statement);

    if (className) {
      this.doAddClassName(glyph, className);
    }
  }

  private doAddClassName(glyph: MHTMLGlyphWord, className: string): void {
    glyph.el.classList.add(className);
  }
}
