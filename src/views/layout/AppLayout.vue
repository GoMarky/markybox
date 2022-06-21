<template>
  <div>
    <app-header />
    <app-drawer />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import AppHeader from '@/views/components/AppHeader.vue';
import AppDrawer from '@/views/components/AppDrawer.vue';
</script>

<script lang="ts">
export default { name: 'AppLayout' };
</script>
