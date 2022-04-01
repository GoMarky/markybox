<template>
  <div>
    <app-header />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '@/views/components/AppHeader.vue';
import { Component } from '@/code/vue/common/component-names';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: Component.AppLayout,
    components: {
      AppHeader,
    }
  })
})
</script>
