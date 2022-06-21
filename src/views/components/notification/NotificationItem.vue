<template>
  <div class="notification" :class="notificationClass">
    <h4 class="notification__title"> {{ title }} </h4>
    <p class="notification__text">
      {{ text }}
    </p>
    <div class="notification__close">
      <UIButton @click.native="closeNotification(index)">
        Close
      </UIButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UIButton from '../ui/UIButton';
import { useNotifications, NotificationLevel } from '@/views/components/notification/use-notifications';
import { computed } from 'vue';
const { closeNotification } = useNotifications();

const props = defineProps({
  title: { type: String, required: true },
  index: { type: Number, required: true, },
  level: { type: Number, required: true, },
  text: { type: String, required: false, },
})

const notificationClass = computed(() => {
  switch (props.level) {
    case NotificationLevel.Info:
      return 'notification_info';
    case NotificationLevel.Warning:
      return 'notification_warning';
    case NotificationLevel.Error:
      return 'notification_error';
  }
})
</script>

<script lang="ts">
export default {
  name: 'NotificationItem'
}
</script>

<style lang="sass">
.notification
  display: flex
  flex-direction: column
  background-color: var(--background-default)
  width: 260px
  padding: 10px
  border-radius: 5px

.notification__title
  font-size: 16px
  margin: 0
  padding: 0

.notification__close
  align-self: flex-end
</style>
