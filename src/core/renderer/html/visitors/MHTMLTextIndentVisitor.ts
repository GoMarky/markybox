import { MObject } from '@/core/objects/MObject';
import { IVisitor } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { MHTMLRenderer } from '@/core';

const BASE_INDENT_SPACE = 4;

export class MHTMLTextIndentVisitor extends MObject implements IVisitor {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  public visit(_fragment: MHTMLNodeFragment): void {
    // const { controller } = this.renderer;
  }
}

