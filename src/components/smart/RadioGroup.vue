<template>
  <div class="flex flex-col" role="radiogroup">
    <!-- Added role="radiogroup" -->
    <HoppSmartRadio
      v-for="(radio, index) in radios"
      :key="`radio-${index}`"
      :value="radio.value"
      :label="radio.label"
      :selected="modelValue === radio.value"
      @change="updateModelValue(radio.value)"
      :aria-checked="modelValue === radio.value ? 'true' : 'false'"
      :aria-posinset="index + 1"
      :aria-setsize="radios.length"
      :tabindex="modelValue === radio.value ? 0 : -1"
    />
  </div>
</template>

<script setup lang="ts">
import { HoppSmartRadio } from "."

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

type Radio = {
  value: string
  label: string
}

withDefaults(
  defineProps<{
    radios: Radio[]
    modelValue: string
  }>(),
  {
    radios: [],
    modelValue: "",
  },
)

const updateModelValue = (value: string) => {
  emit("update:modelValue", value)
}
</script>
