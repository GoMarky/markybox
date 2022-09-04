<template>
  <div class="page_sandbox">
    <section class="sandbox">
      <article class="sandbox__item">
        <div id="editor-big"></div>
      </article>
      <article class="sandbox__item">
        <div id="editor-small"></div>
      </article>
      <article class="sandbox__item">
        <div id="editor-readonly"></div>
      </article>
    </section>
  </div>
</template>

<script lang="ts" setup>
import * as markybox from '@/core';
import { onMounted } from 'vue';

const editorBig = new markybox.HTMLRenderer();
const editorSmall = new markybox.HTMLRenderer({
  name: 'small',
  width: 600,
  height: 400,
  fullscreen: false,
});
const editorReadonly = new markybox.HTMLRenderer();

onMounted(() => {
  editorSmall.mount('#editor-small');
});
</script>

<style lang="scss">

</style>
