<template>
  <teleport to="#modal-app">
    <div class="user-login">

    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Component } from '@/code/vue/common/component-names';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: Component.UserLoginModal,
    setup() {

    }
  })
})
</script>

<style scoped>

</style>
