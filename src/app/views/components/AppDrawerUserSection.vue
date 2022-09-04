<template>
  <section class="drawer-user">
    <router-link :to="{ name: 'HomePage' }"> {{ `@${userName}` }}</router-link>
    <icon-notification />
  </section>
</template>

<script lang="ts" setup>
import IconNotification from '@/app/views/components/icons/IconNotification.vue';

import useSession from '@/app/views/composables/use-session';

const { userName } = useSession();
</script>

<style lang="sass">
.drawer-user
  display: flex
  align-items: center
  justify-content: space-between
  padding: 5px
  width: auto
</style>
