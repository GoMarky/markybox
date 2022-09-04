<template>
  <nav class="drawer-navigation">
    <ul class="drawer-navigation__list">
      <li class="drawer-navigation__list-item">
        <router-link :to="{ name: 'HomePage' }"> {{ $t('drawer.navigation.home') }} </router-link>
      </li>
      <li class="drawer-navigation__list-item">
        <router-link :to="{ name: 'WorkspacesPage' }"> {{ $t('drawer.navigation.workspaces') }} </router-link>
      </li>
      <li class="drawer-navigation__list-item">
        <router-link :to="{ name: 'NotesPage' }"> {{ $t('drawer.navigation.notes') }} </router-link>
      </li>
      <li class="drawer-navigation__list-item">
        <router-link :to="{ name: 'SettingsPage' }"> {{ $t('drawer.navigation.settings') }} </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
</script>

<style lang="sass">
.drawer-navigation
  margin-top: 5px

  &__list

  &__list-item
    margin-bottom: 5px

    & > a
      padding: 5px 5px 5px 0
      display: block
      width: 100%
</style>
