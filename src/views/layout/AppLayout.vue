<template>
  <div>
    <app-header />
    <app-drawer />
    <app-bottom-navigation />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import AppHeader from '@/views/components/AppHeader.vue';
import AppDrawer from '@/views/components/AppDrawer.vue';
import AppBottomNavigation from '@/views/components/AppBottomNavigation.vue';
</script>

<script lang="ts">
export default { name: 'AppLayout' };
</script>
