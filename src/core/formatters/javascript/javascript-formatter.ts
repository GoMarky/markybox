import { BaseFormatter, CodeStatement } from '@/core/formatters/formatter/base-formatter';
import { IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';
import { JavascriptKeyApplicator } from '@/core/formatters/javascript/javascript-applicator';
import { IAbstractFormatterFactory } from '@/core/formatters/formatter/base-factory';
import { JavascriptFactory } from '@/core/formatters/javascript/javascript-factory';

export type StatementClassName =
  'm-editor__plain'
  | 'm-editor__keyword-identifier'
  | 'm-editor__keyword-identifier-name';

const Regexp = {
  VariableStatement: /^(readonly|from|import|global|declare|object|class|async|await|return|true|false|any|extends|static|let|package|implements|interface|function|new|try|yeild|const|continue|do|catch|in|this|break|as|switch|case|if|throw|else|var|number|string|get|module|type|instanceof|typeof|public|private|enum|export|finally|for|while|void|null|super$)/,
};

export class JavascriptCodeFormatter extends BaseFormatter {
  public readonly applicator: IAbstractKeyApplicator;
  public readonly factory: IAbstractFormatterFactory;

  constructor() {
    super('js');

    this.applicator = new JavascriptKeyApplicator();
    this.factory = new JavascriptFactory();
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

