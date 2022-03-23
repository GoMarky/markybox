import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { MObject } from '@/core/objects/MObject';
import { IVisitor } from '@/core/renderer/html/editor/MHTMLEditorBody';

const BASE_INDENT_SPACE = 4;

export class MHTMLTextIndentVisitor extends MObject implements IVisitor {
  constructor() {
    super();
  }

  public visit(_fragment: MHTMLNodeFragment): void {
   //
  }
}
