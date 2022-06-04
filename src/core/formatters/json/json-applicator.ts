import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';

export class JSONKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor() {
    super();
  }

  public backspace() {
    super.backspace();
  }

  public enter() {
    super.enter();
  }
}
