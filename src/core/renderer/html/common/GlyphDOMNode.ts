import { BaseGlyph } from '@/core/objects/BaseGlyph';

export abstract class GlyphDOMNode<T extends Node = Node> extends BaseGlyph {
  protected _el: T;

  constructor(public readonly start: number = 0, public readonly end: number = 0) {
    super();
  }

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
