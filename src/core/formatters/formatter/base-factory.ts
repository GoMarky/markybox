import { MObject } from '@/core/objects/MObject';
import { MHTMLGlyphRow } from '@/core/renderer/html/common/MHTMLGlyphRow';
import { MHTMLNodeFragment } from '@/core/renderer/html/common/MHTMLNodeFragment';

export interface IAbstractFormatterFactory {
  createGlyphRow(): MHTMLGlyphRow;

  createNodeFragment(): MHTMLNodeFragment;
}

export class BaseFormatterFactory extends MObject implements IAbstractFormatterFactory {
  constructor() {
    super();
  }

  public createGlyphRow(): MHTMLGlyphRow {
    return new MHTMLGlyphRow()
  }

  public createNodeFragment(): MHTMLNodeFragment {
    return new MHTMLNodeFragment();
  }
}
