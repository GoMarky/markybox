import { MGlyph } from '@/core/objects/MGlyph';

export abstract class MHTMLGlyphDOM<T extends Node = Node> extends MGlyph {
  protected _el: T;

  public get el(): T {
    return this._el;
  }
}
