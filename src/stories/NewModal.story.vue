<template>
  <Story title="New Modal">
    <button @click="openTestModal">Open Modal</button>
  </Story>
</template>

<script lang="ts" setup>
import { useModals } from "vue-promise-modals"
import { HoppModal } from "../components/modal"

const { openModal } = useModals()

function openTestModal() {
  openModal(HoppModal, {
    openCount: 0
  })
}
</script>