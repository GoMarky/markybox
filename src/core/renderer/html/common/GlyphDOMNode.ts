import { BaseGlyph } from '@/core/objects/BaseGlyph';

export abstract class GlyphDOMNode<T extends Node = Node> extends BaseGlyph {
  protected _el: T;

  public get el(): T {
    return this._el;
  }
}
