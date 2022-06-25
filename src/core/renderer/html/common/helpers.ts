export const EditorCSSName = {
  Identifier: 'marky__identifier',
  IdentifierName: 'marky__identifier-name',
  IdentifierString: 'marky__identifier-string',
  ClassName: 'marky__class-name',
  Comment: 'marky__comment',

  CellGutter: 'marky__gutter-cell',
  CellGutterWidget: 'marky__gutter-cell-widget',

  NodeIndent: 'marky__indent-node',
  NodeSpecialChar: 'marky__special-char',
  NodeWord: 'marky__word-node',
  NodeParen: 'marky__paren-node',

  GutterContainer: 'marky__gutter',
  Row: 'marky__row',
  Body: 'marky__body',
  Textarea: 'marky__textarea',

  LayerCaretLabel: 'marky__layer-caret-label',
  LayerCaret: 'marky__layer-caret',
  LayerText: 'marky__layer-text',
  LayerPartition: 'marky__layer-partition',
  Layer: 'marky__layer',
  LayerMarker: 'marky__layer-marker',
  LayerCaretContainer: 'marky__layer-caret-container',
  LayerActiveLine: 'marky__layer-marker-active-line',
  LayerSelection: 'marky__layer-selection',
  SelectionRow: 'marky__selection-row',
}

export interface IDOMPosition {
  left: number;
  top: number;
}

const indentLength = 4;

export const BASE_INDENT_VALUE = Array.from({ length: indentLength }, () => ' ').join('');
