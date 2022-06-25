import { BaseGlyph } from '@/core/objects/BaseGlyph';

export abstract class GlyphDOMNode<T extends Node = Node> extends BaseGlyph {
  protected _el: T;

  public get text(): string {
    return this._el.textContent || '';
  }

  public get length(): number {
    return this.text.length;
  }

  public get el(): T {
    return this._el;
  }
}
