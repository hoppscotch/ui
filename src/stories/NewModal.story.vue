<template>
  <Story title="New Modal (HoppModal) [Beta]">
    <Variant title="Simple Dialog with Close Button">
      <HoppButton @click="openTestModal" label="Open Simple Dialog" />
    </Variant>
    <Variant title="Dialog with Input">
      <div class="mb-3">
        <span>Status: </span>
        <span v-if="modalWithInputReturn === undefined"> Not Opened </span>

        <span
          v-else-if="modalWithInputReturn.type === 'resolve'"
          :style="{ color: 'green' }"
        >
          Resolved with value '{{ modalWithInputReturn.value }}'
        </span>

        <span
          v-else-if="modalWithInputReturn.type === 'reject'"
          :style="{ color: 'red' }"
        >
          Cancelled
        </span>
      </div>

      <HoppButton
        @click="openInputDialog"
        label="Open Dialog with Input"
      />
    </Variant>
    <Variant title="Nested Dialog with Input">
      <div class="mb-3">
        <span>Status: </span>
        <span v-if="modalWithInputReturn === undefined"> Not Opened </span>

        <span
          v-else-if="modalWithInputReturn.type === 'resolve'"
          :style="{ color: 'green' }"
        >
          Resolved with value '{{ modalWithInputReturn.value }}'
        </span>

        <span
          v-else-if="modalWithInputReturn.type === 'reject'"
          :style="{ color: 'red' }"
        >
          Cancelled
        </span>
      </div>

      <HoppButton
        @click="openNestedInputDialog"
        label="Open Dialog with Input"
      />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import {
  InputDialog,
  GreetingsModal,
  NestedDialog,
} from "../components/modal/examples"
import { HoppButton, useModals } from ".."

const { openModal } = useModals()

async function openTestModal() {
  await openModal(GreetingsModal)
}

const modalWithInputReturn = ref<
  undefined | { type: "resolve"; value: string } | { type: "reject" }
>()

async function openInputDialog() {
  try {
    const result = await openModal(InputDialog, {
      title: "Dialog with Input field",
    })
    modalWithInputReturn.value = { type: "resolve", value: result.text }
  } catch (e) {
    // The error value will be the same value as emitted through the `modal-reject` event
    console.log("Modal Rejected:", e)
    modalWithInputReturn.value = { type: "reject" }
  }
}

async function openNestedInputDialog() {
  try {
    const result = await openModal(NestedDialog, {
      title: "Nested Input Dialog",
    })
    modalWithInputReturn.value = { type: "resolve", value: result.text }
  } catch (e) {
    // The error value will be the same value as emitted through the `modal-reject` event
    console.log("Modal Rejected:", e)
    modalWithInputReturn.value = { type: "reject" }
  }
}
</script>
