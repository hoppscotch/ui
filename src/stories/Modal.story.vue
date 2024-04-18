<template>
  <Story title="Modal (Deprecated)">
    <button @click="showModal()">Show Modal</button>

    <HoppSmartModal
      :show="show"
      :title="'Modal Title'"
      @hide-modal="show = false"
      @resolve="resolveConfirmModal($event)"
    />
  </Story>
</template>

<script lang="ts" setup>
import { HoppSmartModal } from "../components/smart"
import { ref } from "vue"

const show = ref(false)

const resolveConfirmModal = (resolve: string | null) => {
  alert("resolved: " + resolve)
  show.value = false
}

const showModal = () => {
  show.value = true
}
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
  cursor: pointer;
  color: #333;
}
</style>
