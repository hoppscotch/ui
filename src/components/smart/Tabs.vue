<template>
  <div
    class="flex h-full flex-1 flex-nowrap"
    :class="{ '!h-auto !flex-col': !vertical }"
  >
    <div
      class="tabs relative border-dividerLight"
      :class="[vertical ? 'border-r' : 'border-b', styles]"
    >
      <div class="flex flex-1">
        <div
          class="flex flex-1 justify-between"
          :class="{ 'flex-col': vertical }"
        >
          <template
            v-for="(tabGroup, alignment) in alignedTabs"
            :key="alignment"
          >
            <div
              class="flex flex-1"
              :class="{
                'flex-col space-y-2 p-2': vertical,
                'justify-end': alignment === 'right',
              }"
            >
              <button
                v-for="([tabID, tabMeta], index) in tabGroup"
                :key="`tab-${index}`"
                v-tippy="{
                  theme: 'tooltip',
                  placement: 'left',
                  content: vertical ? tabMeta.label : null,
                }"
                class="tab"
                :class="[
                  { active: modelValue === tabID },
                  { vertical: vertical },
                  { '!cursor-not-allowed opacity-75': tabMeta.disabled },
                ]"
                :aria-label="tabMeta.label || ''"
                :disabled="tabMeta.disabled"
                role="button"
                @keyup.enter="selectTab(tabID)"
                @click="selectTab(tabID)"
              >
                <component
                  :is="tabMeta.icon"
                  v-if="tabMeta.icon"
                  class="svg-icons"
                  :class="{ 'mr-2': tabMeta.label && !vertical }"
                />
                <span v-if="tabMeta.label && !vertical">{{
                  tabMeta.label
                }}</span>
                <span
                  v-if="tabMeta.info && tabMeta.info !== 'null'"
                  class="tab-info"
                >
                  {{ tabMeta.info }}
                </span>
                <span
                  v-if="tabMeta.indicator"
                  class="ml-2 h-1 w-1 rounded-full"
                  :class="indicatorDotClass(tabMeta.indicatorVariant)"
                ></span>
              </button>
            </div>
          </template>
          <div class="flex items-center justify-center">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </div>
    <div
      class="contents h-full w-full"
      :class="[
        {
          '!flex flex-1 flex-col overflow-y-auto': vertical,
        },
        contentStyles,
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { pipe } from "fp-ts/function"
import { not } from "fp-ts/Predicate"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import type { Component, Ref } from "vue"
import { ref, ComputedRef, computed, provide, onBeforeUnmount } from "vue"

/**
 * Color of the indicator dot. `"accent"` (default) is neutral activity; the
 * semantic variants map to feedback colors (e.g. `"error"` flags a tab that
 * needs attention). Optional/undefined falls back to accent for older consumers.
 */
export type IndicatorVariant = "accent" | "error" | "warning" | "success" | "info"

export type TabMeta = {
  label: string | null
  icon: string | Component | null
  indicator: boolean
  indicatorVariant?: IndicatorVariant
  info: string | null
  disabled: boolean
  alignLast: boolean
  /**
   * Display-order hint. Lower numbers render earlier. Defaults to 0 so the
   * sort is stable in registration order for tabs that don't opt in.
   * Lets consumers pin certain tabs (e.g. workspace-mode-specific tabs
   * that appear/disappear via v-if) to a fixed position without relying
   * on the order in which Vue mounts them.
   *
   * Optional for backward compatibility — older `<HoppSmartTab>` consumers
   * that predate this field still work; the sort treats `undefined` as 0.
   */
  order?: number
}

export type TabProvider = {
  // Whether inactive tabs should remain rendered
  renderInactive: ComputedRef<boolean>
  activeTabID: ComputedRef<string>
  addTabEntry: (tabID: string, meta: TabMeta) => void
  updateTabEntry: (tabID: string, newMeta: TabMeta) => void
  removeTabEntry: (tabID: string) => void
  isUnmounting: Ref<boolean>
}

const props = defineProps({
  styles: {
    type: String,
    default: "",
  },
  renderInactiveTabs: {
    type: Boolean,
    default: false,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    required: true,
  },
  contentStyles: {
    type: String,
    default: "",
  },
})

const emit = defineEmits<{
  (e: "update:modelValue", newTabID: string): void
}>()

const throwError = (message: string): never => {
  throw new Error(message)
}

const tabEntries = ref<Array<[string, TabMeta]>>([])

// Tab related logic — render order respects `tabMeta.order` as a primary
// sort key, with registration order as a stable tiebreaker. This lets
// consumers pin a tab to a specific position regardless of when it mounts
// (e.g. tabs gated behind `v-if` that toggle in and out at runtime).
const alignedTabs = computed(() => {
  const indexed = tabEntries.value.map(
    (entry, idx) => [entry, idx] as [[string, TabMeta], number],
  )
  indexed.sort(([[, a], aIdx], [[, b], bIdx]) => {
    const delta = (a.order ?? 0) - (b.order ?? 0)
    return delta !== 0 ? delta : aIdx - bIdx
  })
  const sorted = indexed.map(([entry]) => entry)
  const leftTabs = sorted.filter(([_, tabMeta]) => !tabMeta.alignLast)
  const rightTabs = sorted.filter(([_, tabMeta]) => tabMeta.alignLast)
  return { left: leftTabs, right: rightTabs }
})

const addTabEntry = (tabID: string, meta: TabMeta) => {
  tabEntries.value = pipe(
    tabEntries.value,
    O.fromPredicate(not(A.exists(([id]) => id === tabID))),
    O.map(A.append([tabID, meta] as [string, TabMeta])),
    O.getOrElseW(() => throwError(`Tab with duplicate ID created: '${tabID}'`)),
  )
}

const updateTabEntry = (tabID: string, newMeta: TabMeta) => {
  tabEntries.value = pipe(
    tabEntries.value,
    A.findIndex(([id]) => id === tabID),
    O.chain((index) =>
      pipe(
        tabEntries.value,
        A.updateAt(index, [tabID, newMeta] as [string, TabMeta]),
      ),
    ),
    O.getOrElseW(() => throwError(`Failed to update tab entry: ${tabID}`)),
  )
}

const removeTabEntry = (tabID: string) => {
  tabEntries.value = pipe(
    tabEntries.value,
    A.findIndex(([id]) => id === tabID),
    O.chain((index) => pipe(tabEntries.value, A.deleteAt(index))),
    O.getOrElseW(() => throwError(`Failed to remove tab entry: ${tabID}`)),
  )

  // If we tried to remove the active tabEntries, switch to first tab entry
  if (props.modelValue === tabID)
    if (tabEntries.value.length > 0) selectTab(tabEntries.value[0][0])
}

const isUnmounting = ref(false)

provide<TabProvider>("tabs-system", {
  renderInactive: computed(() => props.renderInactiveTabs),
  activeTabID: computed(() => props.modelValue),
  addTabEntry,
  updateTabEntry,
  removeTabEntry,
  isUnmounting,
})

onBeforeUnmount(() => {
  isUnmounting.value = true
})

// Maps each indicator variant to its dot color. Hoisted out of the lookup
// function so it isn't reallocated on every render; typed
// `Record<IndicatorVariant, string>` so extending the union forces a matching
// entry here. Literal class strings (not interpolated) so Tailwind's JIT
// compiles them into the shipped stylesheet.
const INDICATOR_DOT_CLASSES: Record<IndicatorVariant, string> = {
  accent: "bg-accentLight",
  error: "bg-error",
  warning: "bg-warning",
  success: "bg-success",
  info: "bg-info",
}

// Falls back to the accent class for an undefined or — since Vue doesn't enforce
// the TS union at runtime — unrecognized `variant`, so the dot always renders a
// visible color instead of silently dropping the class.
const indicatorDotClass = (variant?: IndicatorVariant): string =>
  INDICATOR_DOT_CLASSES[variant ?? "accent"] ?? INDICATOR_DOT_CLASSES.accent

const selectTab = (id: string) => {
  emit("update:modelValue", id)
}
</script>

<style lang="scss" scoped>
.tabs {
  @apply flex;
  @apply whitespace-nowrap;
  @apply overflow-auto;
  @apply flex-shrink-0;

  .tab {
    @apply relative;
    @apply flex;
    @apply flex-shrink-0;
    @apply items-center;
    @apply justify-center;
    @apply px-4 py-2;
    @apply text-secondary;
    @apply font-semibold;
    @apply cursor-pointer;
    @apply hover:text-secondaryDark;
    @apply focus:outline-none;
    @apply focus-visible:text-secondaryDark;
    @apply after:absolute;
    @apply after:left-4;
    @apply after:right-4;
    @apply after:bottom-0;
    @apply after:bg-transparent;
    @apply after:z-[2];
    @apply after:h-0.5;
    @apply after:content-[''];
    @apply focus:after:bg-divider;

    .tab-info {
      @apply inline-flex;
      @apply items-center;
      @apply justify-center;
      @apply px-1;
      @apply min-w-[1rem];
      @apply h-4;
      @apply ml-2;
      @apply text-[8px];
      @apply border border-divider;
      @apply rounded;
      @apply text-secondaryLight;
    }

    &.active {
      @apply text-secondaryDark;
      @apply after:bg-accent;

      .tab-info {
        @apply text-secondary;
        @apply border-dividerDark;
      }
    }

    &.vertical {
      @apply p-2;
      @apply rounded;
      @apply focus:after:hidden;

      &.active {
        @apply text-accent;
        @apply after:hidden;

        .tab-info {
          @apply text-secondary;
          @apply border-dividerDark;
        }
      }
    }
  }
}
</style>
