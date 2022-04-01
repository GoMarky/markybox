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

<style lang="sass">
@import "./src/views/styles/global/_base.sass"
</style>
