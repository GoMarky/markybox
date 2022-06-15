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
      const isStatement = this.checkStatement(glyph);

      if (isStatement) {
        continue;
      }

      const previousGlyph = glyphs[index - 1];
      const isStatementName = this.checkStatementName(glyph, previousGlyph);

      if (isStatementName) {
        continue;
      }

      const isStringStatement = this.checkIsString(glyph);

      if (isStringStatement) {
        continue;
      }

      const isTypeStatement = this.isTypeStatement(glyph, previousGlyph);
    }
  }

  private isTypeStatement(current: GlyphWordNode, previous?: GlyphWordNode): boolean {
    console.log(current, previous);
    return false;
  }

  private checkIsString(word: GlyphWordNode): boolean {
    const { text } = word;

    if (text.startsWith('\'') && text.endsWith('\'')) {
      this.doAddClassName(word, 'm-editor__keyword-identifier-string');
      return true;
    }

    return false;
  }

  private checkStatementName(current: GlyphWordNode, previous?: GlyphWordNode): boolean {
    if (!previous) {
      return false;
    }

    const { formatter } = this.body;

    const statement = formatter.parseKeyword(previous.text);

    switch (statement) {
      case CodeStatement.VariableDeclaration: {
        this.doAddClassName(current, 'm-editor__keyword-identifier-name');
        return true;
      }
    }

    return false;
  }

  private checkStatement(glyph: GlyphWordNode): boolean {
    const { formatter } = this.body;

    const statement = formatter.parseKeyword(glyph.text);
    const className = getClassNameByStatement(statement);

    if (className) {
      this.doAddClassName(glyph, className);
      return true;
    }

    return false;
  }

  private doAddClassName(glyph: GlyphWordNode, className: string): void {
    glyph.el.classList.add(className);
  }
}
