<template>
  <Story title="Toast">
    <Toaster />
    <button @click="openToast">Basic Toast</button>
  </Story>
</template>

<script lang="ts" setup>
import { Toaster } from "vue-sonner"
import { toast } from "./../helpers/toast"

const openToast = () => {
  toast("Basic toast")
}
</script>
