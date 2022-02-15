<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'App',
  });
})
</script>

<style>
body {
  font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>
