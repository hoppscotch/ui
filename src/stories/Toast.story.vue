<template>
  <Story title="Toast">
    <Toaster />
    <button @click="openToast">Basic Toast</button>
  </Story>
</template>

<script lang="ts" setup>
import { Toaster, toast } from "vue-sonner"

const openToast = () => {
  toast("Basic toast")
}
</script>
