<template>
  <HoppModal title="Grettings Modal" @close="emit('modal-reject')">
    <template #body>
      <div>
        <p>
          <HoppSmartInput
            type="text"
            placeholder="Enter some text..."
            v-model="text"
          />
        </p>
      </div>
    </template>
    <template #footer>
      <HoppButtonPrimary
        label="Submit"
        @click="emit('modal-resolve', { text })"
      />
      <HoppButtonSecondary label="Cancel" @click="emit('modal-reject')" />
    </template>
  </HoppModal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HoppModal } from "./../"
import {
  HoppSmartInput,
  HoppButtonSecondary,
  HoppButtonPrimary,
} from "./../../index"

const text = ref<string>("")

const emit = defineEmits<{
  (e: "modal-reject"): void
  (e: "modal-resolve", value: { text: string }): void
}>()
</script>
