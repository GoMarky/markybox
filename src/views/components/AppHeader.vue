<template>
  <header class="marky-header">
    Marky!
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default window.workbench.createComponent(() => {
  return defineComponent({})
});
</script>

<style scoped>
.marky-header {
  width: 100%;
  height: 50px;
}
</style>
