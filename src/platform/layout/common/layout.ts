import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { Ref, ref } from 'vue';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

export class ModalController extends Disposable {
  public readonly isOpen: Ref<boolean> = ref(true);

  public open(): void {
    this.isOpen.value = true;
  }

  public close(): void {
    this.isOpen.value = false;
  }
}

export interface ILayoutService {
  readonly modal: ModalController;
}
