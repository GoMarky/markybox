import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { ILayoutService, ModalController } from '@/platform/layout/common/layout';

export class LayoutService extends Disposable implements ILayoutService {
  public readonly modal: ModalController = new ModalController();

  constructor() {
    super();
  }
}
