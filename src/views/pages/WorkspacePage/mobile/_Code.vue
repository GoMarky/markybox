<template>
  <div class="code">
    <div id="root" class="marky">
      <div v-if="errorMessage.length > 0">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
const { currentRoute, push } = useRouter();
const errorMessage = ref('');

onBeforeRouteUpdate(async (_, __, next) => {
  next();
})

onMounted(async () => {})
</script>
