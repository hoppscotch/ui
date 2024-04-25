<template>
  <Story title="Toast">
    <Toaster richColors />
    <Variant title="Legacy Toast">
      <button @click="launchLegacyToast">Simple Legacy toast</button>
      <button @click="openLegacyToastWithAction">Open Toast with Action</button>
    </Variant>
    <Variant title="New Toast">
      <button @click="openBasicToast">Basic Toast</button>
      <button @click="openSuccessToast">Success Toast</button>
      <button @click="openErrorToast">Error Toast</button>
      <button @click="openToastWithAction">Open Toast with Action</button>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { Toaster } from "vue-sonner"
import { toast } from "./../helpers/toast"

const openBasicToast = () => {
  toast("Basic toast")
}
const openSuccessToast = () => {
  toast("Success toast", { type: "success" })
}
const openErrorToast = () => {
  toast("Error toast", { type: "error" })
}

const openToastWithAction = () => {
  toast.show(`Are you sure?`, {
    duration: 0,
    action: {
      label: "Confirm",
      onClick: (e) => {
        console.log(e)
      },
    },
  })
}

const launchLegacyToast = () => {
  toast.success("Simple Legacy toast")
}

const openLegacyToastWithAction = () => {
  toast.show(`Are you sure?`, {
    duration: 0,
    action: {
      label: `Yes`,
      onClick: (e) => {
        console.log(e)
      },
    },
  })
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
