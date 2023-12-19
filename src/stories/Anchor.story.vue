<template>
  <Story group="components" title="Anchor">
    <div class="text-tiny text-secondaryLight">
      By signing in, you are agreeing to our
      <HoppSmartAnchor
        class="link text-red-800"
        to="https://docs.hoppscotch.io/support/terms"
        blank
        label="Terms of Service"
      />
      and
      <HoppSmartAnchor
        class="link text-red-600"
        to="https://docs.hoppscotch.io/support/privacy"
        blank
        label="Privacy Policy"
      />
    </div>
  </Story>
</template>

<script setup lang="ts">
import { HoppSmartAnchor } from "../components/smart"
</script>
