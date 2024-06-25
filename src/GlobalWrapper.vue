<template>
  <div>
    <Toaster richColors />
    <DialogHost />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { DialogHost } from "vue-promise-modals"
import { Toaster } from "@hoppscotch/vue-sonner"
</script>

<style>
.htw-sandbox-hidden {
  display: block;
}
</style>
