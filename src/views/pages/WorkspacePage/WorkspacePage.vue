<template>
  <div>
    <workspace-mobile-page v-if="isMobile"/>
    <workspace-desktop-page/>
  </div>
</template>

<script lang="ts" setup>
import WorkspaceDesktopPage from './desktop/WorkspaceDesktopPage.vue';
import WorkspaceMobilePage from './mobile/WorkspaceMobilePage.vue';

import { inject } from 'vue';

const isMobile = inject<boolean>('isMobile');
</script>

<script lang="ts">
export default { name: 'WorkspacePage' };
</script>
