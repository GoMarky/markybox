import { ref } from 'vue'
import { isDefined, isNumber, isUndefined } from '@/base/types';
import { IDisposable, toDisposable } from '@/app/platform/lifecycle/common/lifecycle';

export enum NotificationLevel {
  Info,
  Warning,
  Error,
}

export interface INotificationItem {
  title: string;
  text?: string;
  level?: NotificationLevel;
  hideAfter?: number; // milliseconds
}

const notifications = ref<INotificationItem[]>([]);

export function useNotifications() {
  const addNotification = (notification: INotificationItem): IDisposable => {
    const { hideAfter, level } = notification;

    if (isUndefined(level)) {
      notification.level = NotificationLevel.Info;
    }

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
