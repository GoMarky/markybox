import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { GlyphNodeFragment } from '@/core/renderer/html/common/GlyphNodeFragment';
import { GlyphDOMNode } from '@/core/renderer/html/glyphs/GlyphDOMNode';

export class EditorSelectionDetailParser extends Disposable {
  private readonly glyphs: GlyphDOMNode[][];

  constructor(
    fragment: GlyphNodeFragment
  ) {
    super();

    this.glyphs = this.parse(fragment);
  }

  private parse(fragment: GlyphNodeFragment): GlyphDOMNode[][] {
    console.log(fragment);

    return [[]];
  }
}
