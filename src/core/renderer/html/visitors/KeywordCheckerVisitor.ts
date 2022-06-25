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
      return EditorCSSName.Identifier;
    case CodeStatement.Text:
    default:
      return undefined;
  }
}

function addClass(glyph: GlyphDOMNode, className: string): void {
  const element = glyph.el as HTMLElement;

  element.classList.add(className);
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

    let allNextNodesIsCommented = false;

    for (const [index, current] of glyphs.entries()) {
      if (allNextNodesIsCommented) {
        addClass(current, EditorCSSName.Comment);
        continue;
      }

      const isStatement = this.checkStatement(current);
      const previous = glyphs[index - 1];

      if (isStatement) {
        continue;
      }

      const isStatementName = this.checkStatementName(current, previous);

      if (isStatementName) {
        continue;
      }

      const isTypeStatement = this.isTypeStatement(current, previous);

      if (isTypeStatement) {
        continue;
      }

      if (current instanceof GlyphSpecialCharNode && previous instanceof GlyphSpecialCharNode) {
        const isCommentStarted = this.isComment(current, previous);

        if (isCommentStarted) {
          addClass(current, EditorCSSName.Comment);
          addClass(previous, EditorCSSName.Comment);
          allNextNodesIsCommented = true;
        }
      }
    }
  }

  private isComment(current: GlyphSpecialCharNode, previous: GlyphSpecialCharNode): boolean {
    return current.is('/') && previous.is('/');
  }

  private isTypeStatement(_: GlyphDOMNode, __?: GlyphDOMNode): boolean {
    return false;
  }

  private isString(_: GlyphDOMNode): boolean {
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
        addClass(current, EditorCSSName.IdentifierName);
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
      addClass(glyph, className);
      return true;
    }

    return false;
  }
}
