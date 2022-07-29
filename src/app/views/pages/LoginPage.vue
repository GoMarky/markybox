<template>
  <main class="page-login">
    Sign in
  </main>
</template>

<script lang="ts">
import { RouteName } from '@/app/code/vue/route-names';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: RouteName.LoginPage,
    setup() {
      const { push } = useRouter();
    },
  })
})
</script>

<style>
.home {

}
</style>
