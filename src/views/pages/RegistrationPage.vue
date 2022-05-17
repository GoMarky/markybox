<template>
  <main class="page-registration">
    Signup
  </main>
</template>

<script lang="ts">
import { RouteName } from '@/code/vue/common/route-names';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: RouteName.RegistrationPage,
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
