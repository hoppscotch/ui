<template>
  <HoppModal title="Grettings Modal" @close="emit('modal-reject')">
    <template #body>
      <p class="text-secondary">Hello, World!</p>
    </template>
  </HoppModal>
</template>

<script setup lang="ts">
import { HoppModal } from "./../"

const emit = defineEmits<{
  (e: "modal-reject"): void
}>()
</script>
