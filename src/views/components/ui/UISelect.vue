<template>
  <div class="ui-select">
    <div class="ui-select__label">
      {{ label }}
    </div>
    <select
      :value="value"
      @change="$emit('update:value', $event.target.value)">
      <option v-for="option in options" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Component } from '@/code/vue/common/component-names';

export default defineComponent({
  name: Component.UISelect,
  props: {
    label: {
      type: String,
      required: false,
    },
    id: {
      type: String,
    },
    value: {
      type: [String, Number],
    },
    options: {
      type: Array,
      required: true,
    }
  },
  emits: ['update:value'],
});
</script>
