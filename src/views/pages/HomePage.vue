<template>
  <div>
    Home
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { nanoid } from 'nanoid';
import { AppRoute } from '@/views/router/router';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'HomePage',
    setup() {
      const { push } = useRouter();

      // due dev reason
      push({ name: AppRoute.CodePage, params: { id: nanoid(5) } })
    },
  })
})
</script>
