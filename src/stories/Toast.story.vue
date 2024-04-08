<template>
  <Story title="Toast">
    <Toaster />
    <Variant title="Legacy Toast">
      <button @click="launchLegacyToast">Simple Legacy toast</button>
    </Variant>
    <Variant title="New Toast">
      <button @click="openToast">Basic Toast</button>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { Toaster } from "vue-sonner"
import { toast } from "./../helpers/toast"

const openToast = () => {
  toast("Basic toast")
}

const launchLegacyToast = () => {
  toast.success("Simple Legacy toast")
}
</script>
