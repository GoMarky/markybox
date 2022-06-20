<template>
  <div class="notification">
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

<script setup>
import UIButton from '../ui/UIButton';
import { useNotifications } from '@/views/components/notification/use-notifications';

const { closeNotification } = useNotifications();

defineProps({
  title: { type: String, required: true },
  index: { type: Number, required: true, },
  text: { type: String, required: false, },
})
</script>

<script>
export default {
  name: 'NotificationItem'
}
</script>

<style lang="sass">
@import './src/views/styles/global/_theme.sass'
@import './src/views/styles/global/mixins.sass'

.notification
  display: flex
  flex-direction: column
  background-color: $base-background
  width: 260px
  padding: 10px
  border-radius: 5px

.notification__title
  font-size: 16px
  @include offset()

.notification__close
  align-self: flex-end
</style>
