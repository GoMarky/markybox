<template>
  <div>
    <app-header />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '@/views/components/AppHeader.vue';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'AppLayout',
    components: {
      AppHeader,
    }
  })
})
</script>
