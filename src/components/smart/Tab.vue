<template>
  <div v-if="shouldRender" v-show="active" class="flex flex-1 flex-col">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, inject, computed, watch, markRaw } from "vue"
import type { Component } from "vue"
import type { TabMeta, TabProvider, IndicatorVariant } from "./Tabs.vue"

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    icon?: Component | object | string | null
    info?: string | null
    indicator?: boolean
    /**
     * Color of the indicator dot. `"accent"` (default) is neutral activity; the
     * semantic variants (`"error"`, `"warning"`, `"success"`, `"info"`) let
     * consumers flag a tab's state without reaching into the dot's internal
     * classes via `:deep()`.
     */
    indicatorVariant?: IndicatorVariant
    disabled?: boolean
    alignLast?: boolean
    /**
     * Display-order hint. Lower numbers render first; ties resolve by
     * registration order. Useful for tabs that toggle in/out via `v-if`
     * but should still appear in a fixed position when present.
     */
    order?: number
  }>(),
  {
    icon: null,
    indicator: false,
    indicatorVariant: "accent",
    info: null,
    disabled: false,
    alignLast: false,
    order: 0,
  },
)

const tabMeta = computed<TabMeta>(() => ({
  // props.icon can store a component, which should not be made deeply reactive
  icon:
    props.icon && typeof props.icon === "object"
      ? markRaw(props.icon)
      : props.icon,

  indicator: props.indicator,
  indicatorVariant: props.indicatorVariant,
  info: props.info,
  label: props.label,
  disabled: props.disabled,
  alignLast: props.alignLast,
  order: props.order,
}))

const {
  activeTabID,
  renderInactive,
  addTabEntry,
  updateTabEntry,
  removeTabEntry,
  isUnmounting,
} = inject<TabProvider>("tabs-system")!

const active = computed(() => activeTabID.value === props.id)

const shouldRender = computed(() => {
  // If render inactive is true, then it should be rendered nonetheless
  if (renderInactive.value) return true

  // Else, return whatever is the active state
  return active.value
})

onMounted(() => {
  addTabEntry(props.id, tabMeta.value)
})

watch(tabMeta, (newMeta) => {
  updateTabEntry(props.id, newMeta)
})

onBeforeUnmount(() => {
  if (isUnmounting.value) return
  removeTabEntry(props.id)
})
</script>
