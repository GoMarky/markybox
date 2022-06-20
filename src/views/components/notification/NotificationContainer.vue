<template>
  <div class="notification-container">
    <notification-item
      v-for="(notification, index) in notifications"
      :index="index"
      :key="`${notification.title}-${notification.text}`"
      :text="notification.text"
      :title="notification.title" />
  </div>
</template>

<script setup>
import NotificationItem from './NotificationItem';
import { useNotifications } from '@/views/components/notification/use-notifications';

const { notifications } = useNotifications()
</script>

<script>
export default {
  name: 'NotificationContainer'
}
</script>

<style lang="sass">
.notification-container
  right: 0
  top: 50px
  position: absolute
  padding: 20px
  background-color: transparent
</style>
