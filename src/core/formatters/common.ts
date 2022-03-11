export enum JavascriptKeyword {
  Identifier = 'identifier',
  Plain = 'plain',
  Class = 'class',
  Function = 'function',
  Const = 'const',
  Var = 'var',
  Let = 'let',
  Public = 'public',
  Static = 'static',
  LParen = 'lparen'
}

export type KeywordClassName =
  'm-editor__keyword-class'
  | 'm-editor__keyword-function'
  | 'm-editor__plain'
  | 'm-editor__keyword-class-name'
  | 'm-editor__keyword-function-name'
  | 'm-editor__keyword-default';

export interface IParsedFormatterWord {
  keyword: JavascriptKeyword
  data: string;
  className: KeywordClassName;
}
