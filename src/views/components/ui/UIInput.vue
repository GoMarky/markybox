<template>
  <div class="ui-input">
    <label v-if="label" :for="id"> {{ label }} </label>
    <input
      :id="id"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('update:value', $event.target.value)"
      :type="type"
      :name="name"
      class="ui-input__block"
      :style="styles"
      :autocomplete="autocomplete"
    />
    <span>
      {{ hintText }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UIInput',
  props: {
    label: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      default: 'text',
      required: false,
    },
    id: String,
    styles: {
      type: Object,
      required: false,
    },
    placeholder: String,
    value: [String, Number],
    name: String,
    hintText: String,
    autocomplete: {
      type: String,
      default: 'off',
    }
  },
  emits: ['update:value'],
});
</script>

<style lang="sass">
.ui-input
  display: grid
  color: #7f828b

  & > label
    padding-left: 3px

.ui-input > label
  font-size: 14px
  padding-bottom: 5px

.ui-input__block
  background: none
  border: 1px solid #7f828b
  color: #222222
  background-color: inherit
  min-height: 35px
  padding-left: 10px
  font-family: inherit
  font-size: 14px

</style>
