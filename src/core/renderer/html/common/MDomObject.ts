import { MObject } from '@/core/objects/MObject';

export class MDomObject extends MObject {
  protected _el: HTMLElement;

  public get el(): HTMLElement {
    return this._el;
  }
}
