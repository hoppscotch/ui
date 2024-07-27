<template>
    <div
      :style="{ backgroundColor: color, color: textColor }"
      class="inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold"
    >
      {{ value }}
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    color: {
      type: String,
      default: "#000000", // Default background color if none is provided
    },
    textColor: {
      type: String,
      default: "#ffffff", // Default text color if none is provided
    },
    value: {
      type: String,
      default: "Badge", // Default value if none is provided
    },
  })
  </script>
  
  <style scoped>
  div {
    @apply transition;
  }
  </style>
  