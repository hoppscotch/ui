<template>
  <div
    :style="{ backgroundColor: bg, color: color }"
    class="inline-flex items-center justify-center px-3 py-1 font-semibold hover:bg-opacity-80"
    :class="[style === 'rounded' ? 'rounded-full' : 'rounded-md', 'transition']"
  >
    {{ value }}
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    bg: string
    color: string
    value: string
    style: "rounded" | "pill"
  }>(),
  {
    bg: "#000000",
    color: "#ffffff",
    value: "Badge",
    style: "rounded",
  },
)
</script>

<style scoped>
div {
  @apply transition;
}
</style>
