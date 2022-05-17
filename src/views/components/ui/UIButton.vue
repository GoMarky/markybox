<template>
  <div class="ui-button">
    <button :style="styles" class="btn btn_secondary ui-button__block" type="button" :disabled="disabled">
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UIButton',
  props: {
    styles: {
      type: Object,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
});
</script>

<style lang="sass">
.ui-button__block
  display: block
  background: #ffffff none
  font-size: 14px
  outline: 0
  border: 1px solid #696969
  text-align: center
  cursor: pointer
  padding: 3px 7px
  user-select: none
  touch-action: manipulation

  &:hover
    color: #ffffff
    background-color: #696969
    border-color: #ffffff


</style>
