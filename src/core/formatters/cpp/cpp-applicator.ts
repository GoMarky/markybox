import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';

export class CPPKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
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
