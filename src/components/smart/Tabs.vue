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
                v-for="([tabID, tabMeta]) in tabGroup"
                :key="tabID"
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
import type { Component, ComputedRef, Ref } from "vue"
import { ref, computed, provide, onBeforeUnmount } from "vue"

/** Color of the indicator dot; defaults to `"accent"`. */
export type IndicatorVariant =
  | "accent"
  | "error"
  | "warning"
  | "success"
  | "info"

export type TabMeta = {
  label: string | null
  icon: string | Component | null
  indicator: boolean
  indicatorVariant?: IndicatorVariant
  info: string | null
  disabled: boolean
  alignLast: boolean
  /** Display-order hint; lower renders earlier (default 0). */
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

// Resolves a tab's sort weight, coercing string `order` (e.g. `order="1"`) via
// `Number()`. The `typeof` guard maps `undefined`/`Symbol` to 0 *before* calling
// `Number()` (`Number(Symbol())` throws); non-finite coercions fall to 0 too.
const orderOf = (meta: TabMeta): number => {
  const raw = meta.order
  if (typeof raw !== "number" && typeof raw !== "string") return 0
  const n = Number(raw)
  return Number.isFinite(n) ? n : 0
}

// Render order: `order` ascending, then registration index as a stable tiebreak.
const alignedTabs = computed(() => {
  const indexed = tabEntries.value.map(
    (entry, idx) => [entry, idx] as [[string, TabMeta], number],
  )
  indexed.sort(([[, a], aIdx], [[, b], bIdx]) => {
    const delta = orderOf(a) - orderOf(b)
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

  // If the active tab was removed, activate the first *enabled* tab in render
  // order (from `alignedTabs`, matching the template); if all are disabled, take
  // the first anyway so the active id never points at the just-removed tab.
  if (props.modelValue === tabID) {
    const ordered = [...alignedTabs.value.left, ...alignedTabs.value.right]
    const next = ordered.find(([, meta]) => !meta.disabled) ?? ordered[0]
    if (next) selectTab(next[0])
  }
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

// Variant → dot color. Literal class strings (not interpolated) so Tailwind's
// JIT keeps them in the build.
const INDICATOR_DOT_CLASSES: Record<IndicatorVariant, string> = {
  accent: "bg-accentLight",
  error: "bg-error",
  warning: "bg-warning",
  success: "bg-success",
  info: "bg-info",
}

// Falls back to accent for an unknown variant (the TS union isn't enforced at
// runtime); the own-property check avoids inherited keys resolving to non-strings.
const indicatorDotClass = (variant?: IndicatorVariant): string => {
  const key = variant ?? "accent"
  return Object.prototype.hasOwnProperty.call(INDICATOR_DOT_CLASSES, key)
    ? INDICATOR_DOT_CLASSES[key]
    : INDICATOR_DOT_CLASSES.accent
}

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
