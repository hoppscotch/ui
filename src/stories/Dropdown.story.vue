<template>
  <Story title="Dropdown">
    <Variant title="Single">
      <HoppSmartDropdown @item-click="handleItemClick" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { HoppSmartDropdown } from "../components/smart";

const handleItemClick = (item:any) => {
  console.log('Item clicked:', item);
};
</script>
