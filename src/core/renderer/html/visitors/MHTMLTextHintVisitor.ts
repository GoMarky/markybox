import { MObject } from '@/core/objects/MObject';
import { IVisitor } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { MHTMLRenderer } from '@/core';

export class MHTMLTextHintVisitor extends MObject implements IVisitor {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  public visit(fragment: MHTMLNodeFragment): void {
    const { renderer } = this;
    const { navigator } = renderer;

    const position = navigator.position;
  }
}
