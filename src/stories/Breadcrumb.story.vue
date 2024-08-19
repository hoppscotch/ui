<template>
  <Story title="Breadcrumb">
    <Variant title="Single">
      <HoppBreadcrumb
        :items="['Home', 'Library', 'Data']"
        @select="onBreadcrumbSelect"
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { HoppBreadcrumb } from "../components"

const onBreadcrumbSelect = (value: { item: string; index: number }) => {
  alert(`Selected: ${value.item} at index: ${value.index}`)
}
</script>
