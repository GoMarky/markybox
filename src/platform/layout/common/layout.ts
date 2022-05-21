import { createDecorator } from '@/platform/instantiation/common/instantiation';
import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import { Ref, ref } from 'vue';

export const ILayoutService = createDecorator<ILayoutService>('layoutService');

type ModalName = 'UserLoginModal' | 'UserProfileModal';

interface INotificationItem {
  title: string;
  text?: string;
  hideAfter?: number;
}

export class NotificationController extends Disposable {
  public readonly notifications: Ref<INotificationItem[]> = ref([]);

  public info(notification: INotificationItem): void {
    this.notifications.value.push(notification);
  }
}

export class ModalController extends Disposable {
  public readonly isOpen: Ref<boolean> = ref(false);
  public readonly currentModal: Ref<string | null> = ref(null);

  public open(modalName: ModalName): void {
    window.$editor?.lock();

    this.currentModal.value = modalName;
    this.isOpen.value = true;
  }

  public close(): void {
    window.$editor?.unlock();

    this.currentModal.value = null;
    this.isOpen.value = false;
  }
}

export interface ILayoutService {
  readonly modal: ModalController;
  readonly notification: NotificationController;
}
