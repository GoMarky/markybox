import { ref } from 'vue'
import { isNumber } from '@/base/types';
import { IDisposable, toDisposable } from '@/platform/lifecycle/common/lifecycle';

export interface INotificationItem {
  title: string;
  text?: string;
  hideAfter?: number; // milliseconds
}

const notifications = ref<INotificationItem[]>([]);

export function useNotifications() {
  const addNotification = (notification: INotificationItem): IDisposable => {
    const { hideAfter } = notification;
    const index = notifications.value.push(notification) - 1;

    const close = () => {
      notifications.value.splice(index, 1);
    }

    if (!isNumber(hideAfter)) {
      return toDisposable(close);
    }

    window.setTimeout(() => {
      close();
    }, hideAfter);

    return toDisposable(close);
  };

  const closeNotification = (index: number): void => {
    notifications.value.splice(index, 1);
  };

  return {
    closeNotification,
    addNotification,
    notifications,
  };
}
