export const EditorCSSName = {
  identifier: 'm-editor__identifier',
  identifierName: 'm-editor__identifier-name',
  identifierString: 'm-editor__identifier-string',
  className: 'm-editor__class-name',
}

export interface IDOMPosition {
  left: number;
  top: number;
}

const indentLength = 4;

export const BASE_INDENT_VALUE = Array.from({ length: indentLength }, () => ' ').join('');
