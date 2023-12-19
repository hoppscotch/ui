<template>
  <Story
    group="components"
    title="Button"
    :layout="{
      type: 'grid',
      width: 200,
    }"
  >
    <Variant title="Primary">
      <HoppButtonPrimary label="Button" />
    </Variant>
    <Variant title="Secondary">
      <HoppButtonSecondary label="Button" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { HoppButtonPrimary, HoppButtonSecondary } from "../components/button"
</script>
