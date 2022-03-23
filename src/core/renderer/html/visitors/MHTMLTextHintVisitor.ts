import { MAbstractVisitor } from '@/core/objects/MAbstractVisitor';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLGlyphRow';

export class MHTMLTextHintVisitor extends MAbstractVisitor<MHTMLNodeFragment> {
  constructor() {
    super();
  }

  public visit(fragment: MHTMLNodeFragment): void {
    console.log(fragment);
  }
}
