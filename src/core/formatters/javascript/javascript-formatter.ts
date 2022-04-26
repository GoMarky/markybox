import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';

export enum JavascriptKeyword {
  Class = 'class',
  Function = 'function',
  Const = 'const',
  Var = 'var',
  Let = 'let',
  Public = 'public',
  Static = 'static',
}

export type StatementClassName =
  'm-editor__plain'
  | 'm-editor__keyword-identifier'
  | 'm-editor__keyword-identifier-name';

export const Regexp = {
  VariableStatement: /^(default|const|let|var|class|function|export|import|interface|type|public|private|static|protected|extends|implements|switch|case|break|continue$)/,
};


export class JavascriptCodeFormatter extends BaseFormatter {
  constructor() {
    super();
  }

  public static get formatterName(): string {
    return 'javascript';
  }

  public static parseKeyword(input: string): CodeStatement | undefined {
    const isVariableStatement = Regexp.VariableStatement.test(input);

    switch (true) {
      case isVariableStatement:
        return CodeStatement.VariableDeclaration;
      default:
        return undefined;
    }
  }
}

