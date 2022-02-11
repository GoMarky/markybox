<template>
  <div class="marky">
    Welcome to markybox
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'App',
    setup() {}
  });
})
</script>
