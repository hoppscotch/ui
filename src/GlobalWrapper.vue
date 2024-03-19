<template>
  <div>
    <DialogHost />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { DialogHost } from "vue-promise-modals"
</script>

<style>
.htw-sandbox-hidden {
  display: block;
}
</style>