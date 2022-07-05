import { AbstractKeyApplicator, IAbstractKeyApplicator } from '@/core/formatters/formatter/base-applicator';

export class CPPKeyApplicator extends AbstractKeyApplicator implements IAbstractKeyApplicator {
  constructor() {
    super();
  }

  public backspace(options: { isRepeat: boolean }) {
    super.backspace(options);
  }

  public enter() {
    super.enter();
  }
}
