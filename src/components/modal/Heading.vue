<template>
  <div
    v-if="title"
    class="flex items-center justify-between border-b border-dividerLight p-4"
  >
    <div class="flex flex-1 items-center justify-start">
      <slot name="actions"></slot>
    </div>
    <div class="flex items-center justify-center">
      <h3 class="heading">
        {{ title }}
      </h3>
    </div>
    <div class="flex flex-1 items-center justify-end">
      <HoppButton
        v-if="showCloseIcon"
        v-tippy="{ theme: 'tooltip', delay: [500, 20] }"
        :title="closeText ?? t?.('action.close') ?? 'Close'"
        :icon="IconX"
        @click="close"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue"
import { HOPP_UI_OPTIONS, HoppUIPluginOptions } from "./../../plugin"
import IconX from "~icons/lucide/x"
import { HoppButton } from "./../button"

const { t } = inject<HoppUIPluginOptions>(HOPP_UI_OPTIONS) ?? {}

defineProps<{
  title: string
  showCloseIcon?: boolean
  closeText?: string | null
}>()

const emit = defineEmits<{
  (e: "close"): void
}>()

const close = () => {
  emit("close")
}
</script>
