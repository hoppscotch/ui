<template>
  <div class="l-toast">
    <div class="l-toast-title">
      {{ message }}
    </div>
    <div class="l-toast-actions">
      <button
        v-for="item in actions"
        :key="item.text"
        @click="handleOnClick($event, item)"
        class="action ripple cursor-pointer"
      >
        {{ item.text }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue"

export type LegacyToastAction = {
  text: string
  onClick: (
    event?: MouseEvent,
    toast?: {
      goAway: (delay?: number) => void
    },
  ) => void
}

defineProps({
  message: {
    type: String,
    required: true,
  },
  actions: {
    type: [Array] as PropType<LegacyToastAction[]>,
  },
})

const emit = defineEmits<{
  (e: "closeToast", delay?: number): void
}>()

const handleOnClick = (event: MouseEvent, item: LegacyToastAction) => {
  item.onClick(event, {
    goAway: (delay) => {
      emit("closeToast", delay)
    },
  })
}
</script>
