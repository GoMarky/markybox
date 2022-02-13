<template>
  <main>
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'AppLayout',
  })
})
</script>
