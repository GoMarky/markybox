import { Disposable } from '@/app/platform/lifecycle/common/lifecycle';
import { ILayoutService, ModalController } from '@/app/platform/layout/common/layout';

export class LayoutService extends Disposable implements ILayoutService {
  public readonly modal: ModalController;

  constructor() {
    super();

    this.modal = new ModalController();
  }
}
