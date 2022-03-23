import { MHTMLGlyphDOM } from '@/core/renderer/html/common/MHTMLGlyphDOM';

export abstract class MLayer extends MHTMLGlyphDOM<HTMLDivElement> {
  protected zIndex = 0;
}
