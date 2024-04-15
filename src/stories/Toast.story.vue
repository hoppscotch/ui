<template>
  <Story title="Toast">
    <Toaster richColors />
    <Variant title="Legacy Toast">
      <button @click="launchLegacyToast">Simple Legacy toast</button>
    </Variant>
    <Variant title="New Toast">
      <button @click="openBasicToast()">Basic Toast</button>
      <button @click="openSuccessToast">Success Toast</button>
      <button @click="openErrorToast">Error Toast</button>
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

const launchLegacyToast = () => {
  toast.success("Simple Legacy toast")
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
