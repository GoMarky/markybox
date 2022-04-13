import { MObject } from '@/core/objects/MObject';
import { IVisitor } from '@/core/renderer/html/editor/MHTMLEditorBody';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';
import { MHTMLRenderer } from '@/core';

const arr = [
  'constructor',
  'extends',
  'class',
  'const',
  'implements',
  'interface',
];

export class MHTMLTextHintVisitor extends MObject implements IVisitor {
  constructor(private readonly renderer: MHTMLRenderer) {
    super();
  }

  private generateHints(text: string): string[] {
    return arr.filter(keyword => keyword.startsWith(text));
  }

  public visit(fragment: MHTMLNodeFragment): void {
    const { renderer } = this;
    const { navigator } = renderer;

    const position = navigator.position;
    const textGlyph = fragment.at(position.column);

    if (textGlyph && textGlyph.length > 1) {
      this.generateHints(textGlyph.text);
    }
  }
}
