<template>
  <span
    class="inline-flex items-center justify-center px-2 rounded space-x-1 bg-primaryDark"
  >
    <IconLucideFile class="opacity-75 svg-icons" />
    <span class="max-w-[16rem] truncate"><slot></slot></span>
  </span>
</template>

<script setup lang="ts">
import IconLucideFile from "~icons/lucide/file"
</script>
