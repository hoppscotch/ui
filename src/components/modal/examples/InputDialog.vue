<template>
  <HoppModal
    :title="title ?? 'Dialog with Input field'"
    @close="emit('modal-reject')"
  >
    <template #body>
      <HoppSmartInput
        type="text"
        placeholder="Enter some text..."
        v-model="text"
        @submit="emit('modal-resolve', { text })"
      />
    </template>
    <template #footer>
      <HoppButton
        label="Submit"
        @click="emit('modal-resolve', { text })"
      />
    </template>
  </HoppModal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HoppModal } from "./../"
import {
  HoppSmartInput,
  HoppButton,
} from "./../../index"

const text = ref<string>("")

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: "modal-reject"): void
  (e: "modal-resolve", value: { text: string }): void
}>()
</script>
