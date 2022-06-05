import { BaseObject } from '@/core/objects/BaseObject';
import { IVisitor, MHTMLEditorBody } from '@/core/renderer/html/editor/EditorBodyContainer';
import { GlyphWordNode } from '@/core/renderer/html/common/GlyphWordNode';
import { StatementClassName } from '@/core/formatters/javascript/javascript-formatter';
import { GlyphNodeFragment } from '@/core/renderer/html/common/GlyphNodeFragment';
import { CodeStatement } from '@/core/formatters/formatter/base-formatter';

function getClassNameByStatement(statement?: CodeStatement): StatementClassName | undefined {
  if (!statement) {
    return undefined;
  }

  switch (statement) {
    case CodeStatement.VariableDeclaration:
      return 'm-editor__keyword-identifier';
    case CodeStatement.Text:
    default:
      break;
  }
}

export class KeywordCheckerVisitor extends BaseObject implements IVisitor {
  constructor(
    private readonly body: MHTMLEditorBody
  ) {
    super();
  }

  public visit(fragment: GlyphNodeFragment): void {
    const { children } = fragment;

    const glyphs = children.filter((glyph) => glyph instanceof GlyphWordNode) as GlyphWordNode[];

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

  private checkIsString(word: GlyphWordNode): void {
    const { text } = word;

    if (text.startsWith('\'') && text.endsWith('\'')) {
      this.doAddClassName(word, 'm-editor__keyword-identifier-string');
    }
  }

  private checkStatementName(current: GlyphWordNode, previous?: GlyphWordNode): void {
    if (!previous) {
      return;
    }

    const { formatter } = this.body;

    const statement = formatter.parseKeyword(previous.text);

    switch (statement) {
      case CodeStatement.VariableDeclaration: {
        this.doAddClassName(current, 'm-editor__keyword-identifier-name');
        break;
      }
    }
  }

  private checkStatement(glyph: GlyphWordNode): void {
    const { formatter } = this.body;

    const statement = formatter.parseKeyword(glyph.text);
    const className = getClassNameByStatement(statement);

    if (className) {
      this.doAddClassName(glyph, className);
    }
  }

  private doAddClassName(glyph: GlyphWordNode, className: string): void {
    glyph.el.classList.add(className);
  }
}
