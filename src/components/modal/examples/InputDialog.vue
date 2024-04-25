<!-- GreetModal.vue -->
<template>
  <dialog open>
    <div class="dialog-header">
      <h2>Modal With Input Demo</h2>
      <button class="dialog-close" @click="emit('modal-reject')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19Z"
          />
        </svg>
      </button>
    </div>
    <div>
      <p>
        <input type="text" placeholder="Enter some text..." v-model="text" />
      </p>
    </div>
    <div>
      <button @click="emit('modal-resolve', { text })">Submit</button>
      <button @click="emit('modal-reject')">Cancel</button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { defineEmits, ref } from "vue"
const text = ref("")

// Use emits to define modal outputs
const emit = defineEmits<{
  (e: "modal-reject"): void // Emit can also accept a payload
  (e: "modal-resolve", value: { text: string }): void
}>()
</script>
