<template>
  <div class="flex flex-col items-center justify-center p-4">
    <img
      v-if="src"
      :src="src"
      loading="lazy"
      class="inline-flex flex-col object-contain object-center"
      :class="large ? 'h-32 w-32' : 'h-16 w-16'"
      :alt="alt"
    />
    <slot name="icon"></slot>
    <span v-if="heading" class="mt-2 font-semibold text-center">
      {{ heading }}
    </span>
    <span
      v-if="text"
      class="max-w-sm mt-2 text-center whitespace-normal text-tiny text-secondaryLight"
    >
      {{ text }}
    </span>
    <div v-if="hasBody" class="mt-4">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue"

withDefaults(
  defineProps<{
    src?: string
    alt?: string
    heading?: string
    text?: string
    large?: boolean
  }>(),
  {
    alt: "",
    text: "",
  },
)

const slots = useSlots()

const hasBody = computed(() => {
  return !!slots.body
})
</script>
