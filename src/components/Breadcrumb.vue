<template>
  <nav>
    <ul
      class="flex items-center overflow-x-auto whitespace-nowrap px-4 py-2 text-tiny"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'last-item': index === items.length - 1 }"
        class="flex items-center"
        @click="emit('select', { item, index })"
      >
        <span v-if="index < items.length - 1">
          {{ item }}
        </span>

        <span v-else>
          {{ item }}
        </span>

        <span v-if="index < items.length - 1" class="mx-2">
          <IconChevronRight />
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import IconChevronRight from "~icons/lucide/chevron-right"

defineProps<{
  items: string[]
}>()

const emit = defineEmits<{
  (
    e: "select",
    value: {
      item: string
      index: number
    },
  ): void
}>()
</script>
