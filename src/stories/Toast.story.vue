<template>
  <Story title="Toast">
    <button @click="openBasicToast">Basic Toast</button>
    <button @click="openSuccessToast">Success Toast</button>
    <button @click="openErrorToast">Error Toast</button>
    <button @click="openToastWithAction">Open Toast with Action</button>
  </Story>
</template>

<script lang="ts" setup>
import { toast } from "./../components/toast"

const openBasicToast = () => {
  toast("Basic toast", {
    closeButton: true,
    cancel: {
      label: "Cancel",
      onClick: () => {
        console.log("Cancel")
      },
    },
  })
}
const openSuccessToast = () => {
  toast.success("Success toast")
}
const openErrorToast = () => {
  toast.error("Error toast", {
    action: {
      label: "Dismiss",
      onClick(event) {
        console.log(event)
      },
    },
    duration: Infinity,
  })
}

const openToastWithAction = () => {
  toast(`Are you sure?`, {
    duration: 0,
    action: {
      label: "Confirm",
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
