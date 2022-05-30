import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';

export type StatementClassName =
  'm-editor__plain'
  | 'm-editor__keyword-identifier'
  | 'm-editor__keyword-identifier-name';

export const Regexp = {
  VariableStatement: /^(throw|as|this|void|undefined|string|number|object|super|return|new|default|const|let|var|class|function|export|import|interface|type|public|private|static|protected|extends|implements|switch|case|break|continue$)/,
};

export class JavascriptCodeFormatter extends BaseFormatter {
  constructor() {
    super('js');
  }

  public parseKeyword(input: string): CodeStatement | undefined {
    const isVariableStatement = Regexp.VariableStatement.test(input);

    switch (true) {
      case isVariableStatement:
        return CodeStatement.VariableDeclaration;
      default:
        return CodeStatement.Text;
    }
  }
}

