import { BaseObject } from '@/core/objects/BaseObject';
import { GlyphRowElement } from '@/core/renderer/html/common/GlyphRowElement';
import { GlyphNodeFragment } from '@/core/renderer/html/common/GlyphNodeFragment';

export interface IAbstractFormatterFactory {
  createGlyphRow(): GlyphRowElement;

  createNodeFragment(): GlyphNodeFragment;
}

export class BaseFormatterFactory extends BaseObject implements IAbstractFormatterFactory {
  constructor() {
    super();
  }

  public createGlyphRow(): GlyphRowElement {
    return new GlyphRowElement()
  }

  public createNodeFragment(): GlyphNodeFragment {
    return new GlyphNodeFragment();
  }
}
