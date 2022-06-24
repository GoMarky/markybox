import { BaseObject } from '@/core/objects/BaseObject';
import { IVisitor, MHTMLEditorBody } from '@/core/renderer/html/editor/EditorBodyContainer';
import { GlyphWordNode } from '@/core/renderer/html/common/GlyphWordNode';
import { GlyphNodeFragment } from '@/core/renderer/html/common/GlyphNodeFragment';
import { CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { EditorCSSName } from '@/core/renderer/html/common/helpers';
import { GlyphParenNode } from '@/core/renderer/html/common/GlyphParenNode';
import { GlyphSpecialCharNode } from '@/core/renderer/html/common/GlyphSpecialCharNode';
import { GlyphDOMNode } from '@/core/renderer/html/common/GlyphDOMNode';

function getClassNameByStatement(statement?: CodeStatement): string | undefined {
  if (!statement) {
    return undefined;
  }

  switch (statement) {
    case CodeStatement.VariableDeclaration:
      return EditorCSSName.identifier;
    case CodeStatement.Text:
    default:
      return undefined;
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

    const glyphs = children.filter((glyph) =>
      glyph instanceof GlyphWordNode
      || glyph instanceof GlyphParenNode
      || glyph instanceof GlyphSpecialCharNode);

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

  private isTypeStatement(_: GlyphDOMNode, __?: GlyphDOMNode): boolean {
    return false;
  }

  private checkIsString(_: GlyphDOMNode): boolean {
    return false;
  }

  private checkStatementName(current: GlyphDOMNode, previous?: GlyphDOMNode): boolean {
    if (!previous) {
      return false;
    }

    const { formatter } = this.body;

    const statement = formatter.parseKeyword(previous.text);

    switch (statement) {
      case CodeStatement.VariableDeclaration: {
        this.doAddClassName(current, EditorCSSName.identifierName);
        return true;
      }
    }

    return false;
  }

  private checkStatement(glyph: GlyphDOMNode): boolean {
    const { formatter } = this.body;

    const statement = formatter.parseKeyword(glyph.text);
    const className = getClassNameByStatement(statement);

    if (className) {
      this.doAddClassName(glyph, className);
      return true;
    }

    return false;
  }

  private doAddClassName(glyph: GlyphDOMNode, className: string): void {
    // @ts-ignore
    glyph.el.classList.add(className);
  }
}
