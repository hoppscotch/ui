<template>
  <Story title="Dropdown">
    <Variant>
      <HoppDropdown>
        <template #button>
          <button>Dropdown menu</button>
        </template>
        <template #content>
          <div style="min-width: 300px">
            <p>Dropdown content</p>
          </div>
        </template>
      </HoppDropdown>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { HoppDropdown } from "../components"
</script>
