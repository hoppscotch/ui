<template>
  <span
    class="inline-flex items-center justify-center space-x-1 rounded bg-primaryDark px-2"
  >
    <IconLucideFile class="svg-icons opacity-75" />
    <span class="max-w-54 truncate"><slot></slot></span>
  </span>
</template>

<script setup lang="ts">
import IconLucideFile from "~icons/lucide/file"
</script>
