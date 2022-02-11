import { MObject } from '@/core/objects/MObject';

class MRowContent extends MObject {
  private _content = '';

  constructor() {
    super();
  }

  set content(data: string) {
    this._content = data;
  }

  public get content(): string {
    return this._content;
  }
}

export class MRow extends MObject {
  public readonly content: MRowContent;

  constructor(
    public readonly index: number
  ) {
    super();

    this.content = new MRowContent();
  }
}
