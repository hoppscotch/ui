<template>
  <Story title="New Modal (HoppModal)">
    <Variant title="Simple Dialog with Close Button">
      <button @click="openTestModal">Open Simple Dialog</button>
    </Variant>
    <Variant title="Dialog with Input">
      <p>
        <span>
          Resolved Value: <strong>{{ text }}</strong>
        </span>
      </p>

      <button @click="openInputDialog">Open Dialog with Input</button>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useModals } from "vue-promise-modals"
import { HoppModal, InputDialog } from "../components/modal"

const { openModal } = useModals()

function openTestModal() {
  openModal(HoppModal, {
    openCount: 0,
  })
}

const text = ref("")

async function openInputDialog() {
  try {
    const result = await openModal(InputDialog)
    text.value = result.text
  } catch (e) {
    // The error value will be the same value as emitted through the `modal-reject` event
    console.log("Modal Rejected:", e)
  }
}
</script>
