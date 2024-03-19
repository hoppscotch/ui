<template>
  <dialog ref="dialog">
    <div class="dialog-header">
      <h2>Simple Dialog</h2>
      <button class="dialog-close" @click="emit('modal-resolve', {})">
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
      <p>You have opened this modal {{ openCount }} time(s).</p>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

defineProps<{
  openCount: number
}>()

const emit = defineEmits<{
  (e: "modal-resolve", data: {}): void
}>()

const dialog = ref<HTMLDialogElement>()

onMounted(() => {
  dialog.value?.showModal()
})
</script>

<style lang="scss" scoped>
dialog {
  padding: 0 !important;
  border: 0 !important;
}
</style>
