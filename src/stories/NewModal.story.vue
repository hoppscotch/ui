<template>
  <Story title="New Modal (HoppModal)">
    <Variant title="Simple Dialog with Close Button">
      <button @click="openTestModal">Open Simple Dialog</button>
    </Variant>
    <Variant title="Dialog with Input">
      <div>
        <p>
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
        </p>
      </div>

      <button @click="openInputDialog">Open Dialog with Input</button>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useModals } from "vue-promise-modals"
import { InputDialog, GreetingsModal } from "../components/modal/examples"

const { openModal } = useModals()

async function openTestModal() {
  await openModal(GreetingsModal, {
    openCount: 0,
  })
}

const modalWithInputReturn = ref<
  undefined | { type: "resolve"; value: string } | { type: "reject" }
>()

async function openInputDialog() {
  try {
    const result = await openModal(InputDialog, {})
    modalWithInputReturn.value = { type: "resolve", value: result.text }
  } catch (e) {
    // The error value will be the same value as emitted through the `modal-reject` event
    console.log("Modal Rejected:", e)
    modalWithInputReturn.value = { type: "reject" }
  }
}
</script>
