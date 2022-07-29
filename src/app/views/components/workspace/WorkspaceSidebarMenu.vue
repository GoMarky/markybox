<template>
  <nav class="workspace-sidebar">
    <ul class="workspace-sidebar__nav-list">
      <li class="workspace-sidebar__nav-item">
        <icon-settings />
      </li>
      <li class="workspace-sidebar__nav-item">
        <icon-folder />
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import IconSettings from '@/app/views/components/icons/IconSettings.vue';
import IconFolder from '@/app/views/components/icons/IconFolder.vue';
</script>

<script lang="ts">
export default { name: 'WorkspaceSidebarMenu' };
</script>

<style lang="sass">
.workspace-sidebar
  display: flex
  align-items: center
  flex-direction: column
  height: 100%
  width: 50px
  max-height: 100vh
  max-width: 100vw

  &__nav-list
    display: flex
    align-items: center
    flex-direction: column
    width: 100%
    height: 100%
    padding: var(--space-4) 0

  &__nav-item
    display: flex
    align-items: center
    justify-content: center
    font-size: 24px
    cursor: pointer
    border-radius: var(--border-radius-4)
    width: calc(var(--space-48) - var(--space-8))
    margin-bottom: var(--space-16)
</style>
