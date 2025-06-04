<template>
  <Story title="Button">
    <Variant title="Primary">
      <HoppButton label="Primary Button" />
    </Variant>
    <Variant title="Secondary">
      <HoppButton type="secondary" :outline="true" label="Secondary Button" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { HoppButton } from "../components/button"
</script>
