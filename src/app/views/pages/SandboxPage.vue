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
const editorSmall = new markybox.HTMLRenderer();
const editorReadonly = new markybox.HTMLRenderer();

onMounted(() => {
  editorBig.mount('#editor-big');
});
</script>

<style lang="scss">

</style>
