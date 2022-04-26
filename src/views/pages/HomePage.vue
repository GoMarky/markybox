<template>
  <div>
    Home
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { AppRoute } from '@/views/router/router';

export default window.workbench.createComponent(() => {

  return defineComponent({
    name: 'HomePage',
    setup() {
      const { push } = useRouter();

      push({ name: AppRoute.CodePage, params: { id: '1a9ac498-9141-43f9-a7db-73be48704d50' } })
    },
  })
})
</script>
