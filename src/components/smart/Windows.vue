<template>
  <div class="flex h-auto flex-1 flex-col flex-nowrap overflow-y-hidden">
    <div
      class="tabs group-tabs sticky top-0 z-10 flex-shrink-0 divide-x divide-dividerLight overflow-x-auto bg-primaryLight"
    >
      <div
        class="flex w-0 flex-1 flex-shrink-0 overflow-hidden"
        ref="scrollContainer"
      >
        <div
          class="flex justify-between divide-x divide-dividerLight"
          @wheel.prevent="scroll"
        >
          <div class="flex">
            <draggable
              v-bind="dragOptions"
              :list="tabEntries"
              :style="tabStyles"
              :item-key="'window-'"
              class="flex flex-shrink-0 divide-x divide-dividerLight overflow-x-auto transition"
              @sort="sortTabs"
            >
              <template #item="{ element: [tabID, tabMeta] }">
                <button
                  :key="`removable-tab-${tabID}`"
                  :id="`removable-tab-${tabID}`"
                  class="tab group"
                  :class="[{ active: modelValue === tabID }]"
                  :aria-label="tabMeta.label || ''"
                  role="button"
                  @keyup.enter="selectTab(tabID)"
                  @click="selectTab(tabID)"
                >
                  <span
                    v-if="tabMeta.icon"
                    class="flex cursor-pointer items-center justify-center"
                  >
                    <component :is="tabMeta.icon" class="svg-icons h-4 w-4" />
                  </span>

                  <div
                    v-if="!tabMeta.tabhead"
                    class="w-full truncate px-2 text-left"
                  >
                    <span class="truncate">
                      {{ tabMeta.label }}
                    </span>
                  </div>

                  <div v-else class="w-full truncate text-left">
                    <component :is="tabMeta.tabhead" />
                  </div>

                  <div
                    v-if="tabMeta.suffix"
                    class="flex items-center justify-center"
                  >
                    <component :is="tabMeta.suffix" />
                  </div>

                  <HoppButtonSecondary
                    v-if="tabMeta.isRemovable"
                    v-tippy="{ theme: 'tooltip', delay: [500, 20] }"
                    :icon="IconX"
                    :title="closeText ?? t?.('action.close') ?? 'Close'"
                    :class="[
                      { active: modelValue === tabID },
                      {
                        flex: tabMeta.closeVisibility === 'always',
                        'hidden group-hover:flex':
                          tabMeta.closeVisibility === 'hover',
                        hidden: tabMeta.closeVisibility === 'never',
                      },
                      'close',
                    ]"
                    class="rounded !p-0.25"
                    @click.stop="emit('removeTab', tabID)"
                  />
                </button>
              </template>
            </draggable>
          </div>
          <div
            class="sticky right-0 z-20 flex flex-shrink-0 items-center justify-center overflow-x-auto"
          >
            <span
              v-if="canAddNewTab"
              class="z-[8] flex h-full items-center justify-center bg-primaryLight px-3"
            >
              <HoppButtonSecondary
                v-tippy="{ theme: 'tooltip' }"
                :title="newText ?? t?.('action.new') ?? 'New'"
                :icon="IconPlus"
                class="create-new-tab rounded !p-1 !text-secondaryDark"
                filled
                @click="addTab"
              />
            </span>
          </div>
        </div>
      </div>

      <div v-if="hasActions" :class="mdAndLarger ? 'w-64' : 'w-28'">
        <slot name="actions" />
      </div>

      <input
        type="range"
        min="1"
        :max="MAX_SCROLL_VALUE"
        v-model="thumbPosition"
        class="slider absolute bottom-0 left-0 hidden"
        :class="{
          '!block': scrollThumb.show,
        }"
        :style="[
          `--thumb-width: ${scrollThumb.width}px`,
          `width: calc(100% - ${
            hasActions ? (mdAndLarger ? '19rem' : '10rem') : '3rem'
          })`,
        ]"
        id="myRange"
      />
    </div>
    <div class="contents h-full w-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HoppButtonSecondary } from "../button"
import IconPlus from "~icons/lucide/plus"
import IconX from "~icons/lucide/x"
import { pipe } from "fp-ts/function"
import { not } from "fp-ts/Predicate"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import {
  ref,
  ComputedRef,
  computed,
  provide,
  inject,
  watch,
  nextTick,
  useSlots,
} from "vue"
import {
  breakpointsTailwind,
  useBreakpoints,
  useElementSize,
} from "@vueuse/core"
import type { Slot } from "vue"
import draggable from "vuedraggable-es"
import { HoppUIPluginOptions, HOPP_UI_OPTIONS } from "./../../index"

export type TabMeta = {
  label: string | null
  icon: Slot | undefined
  suffix: Slot | undefined
  tabhead: Slot | undefined
  info: string | null
  isRemovable: boolean
  closeVisibility: "hover" | "always" | "never"
}
export type TabProvider = {
  // Whether inactive tabs should remain rendered
  renderInactive: ComputedRef<boolean>
  activeTabID: ComputedRef<string>
  addTabEntry: (tabID: string, meta: TabMeta) => void
  updateTabEntry: (tabID: string, newMeta: TabMeta) => void
  removeTabEntry: (tabID: string) => void
}

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndLarger = breakpoints.greater("md")

const { t } = inject<HoppUIPluginOptions>(HOPP_UI_OPTIONS) ?? {}

const props = withDefaults(
  defineProps<{
    styles: string
    modelValue: string
    renderInactiveTabs: boolean
    canAddNewTab: boolean
    newText: string | null
    closeText: string | null
  }>(),
  {
    styles: "",
    renderInactiveTabs: false,
    canAddNewTab: true,
    newText: null,
    closeText: null,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", newTabID: string): void
  (e: "sort", body: { oldIndex: number; newIndex: number }): void
  (e: "removeTab", tabID: string): void
  (e: "addTab"): void
}>()

const slots = useSlots()

const hasActions = computed(() => {
  return !!slots.actions
})

const throwError = (message: string): never => {
  throw new Error(message)
}

const TAB_WIDTH = 184
const tabEntries = ref<Array<[string, TabMeta]>>([])
const tabStyles = computed(() => ({
  maxWidth: `${tabEntries.value.length * TAB_WIDTH}px`,
  width: "100%",
  minWidth: "0px",
  // transition: "max-width 0.2s",
}))
const dragOptions = {
  group: "tabs",
  animation: 250,
  handle: ".tab",
  draggable: ".tab",
  ghostClass: "cursor-move",
}
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
}
const sortTabs = (e: {
  oldDraggableIndex: number
  newDraggableIndex: number
}) => {
  emit("sort", {
    oldIndex: e.oldDraggableIndex,
    newIndex: e.newDraggableIndex,
  })
}
provide<TabProvider>("tabs-system", {
  renderInactive: computed(() => props.renderInactiveTabs),
  activeTabID: computed(() => props.modelValue),
  addTabEntry,
  updateTabEntry,
  removeTabEntry,
})
const selectTab = (id: string) => {
  emit("update:modelValue", id)
}
const addTab = () => {
  emit("addTab")
}

/**
 * Scroll related properties
 */

const MAX_SCROLL_VALUE = 500
const scrollContainer = ref<HTMLElement>()
const { width: scrollContainerWidth } = useElementSize(scrollContainer)
const thumbPosition = ref(0)

const scrollThumb = computed(() => {
  const clientWidth = scrollContainerWidth.value ?? 0
  const scrollWidth = tabEntries.value.length * 184

  return {
    width: (clientWidth / scrollWidth) * clientWidth || 300,
    show: clientWidth ? scrollWidth > clientWidth : false,
  }
})

/*
 * Scroll with mouse wheel
 */
const scroll = (e: WheelEvent) => {
  scrollContainer.value!.scrollLeft += e.deltaY
  scrollContainer.value!.scrollLeft += e.deltaX

  const { scrollWidth, clientWidth, scrollLeft } = scrollContainer.value || {
    scrollWidth: 0,
    clientWidth: 0,
    scrollLeft: 0,
  }

  const maxScroll = scrollWidth - clientWidth
  thumbPosition.value = (scrollLeft / maxScroll) * MAX_SCROLL_VALUE
}

/*
 * Scroll with scrollbar/slider
 * when scroll thumb is dragged or clicked on the scrollbar
 */
watch(thumbPosition, (newVal) => {
  const { scrollWidth, clientWidth } = scrollContainer.value!
  const maxScroll = scrollWidth - clientWidth
  scrollContainer.value!.scrollLeft = maxScroll * (newVal / MAX_SCROLL_VALUE)
})

/*
 * Watch TabID changes
 * and scroll to the tab if it's not visible
 */
watch(
  () => props.modelValue,
  (tabID) => {
    nextTick(() => {
      const element = document.getElementById(`removable-tab-${tabID}`)

      const changeThumbPosition: IntersectionObserverCallback = (
        entries,
        observer,
      ) => {
        entries.forEach((entry) => {
          if (entry.target === element && entry.intersectionRatio >= 1.0) {
            // Element is visible now. Stop listening for intersection changes
            observer.disconnect()

            // We still need setTimeout here because the element might not be fully in position yet
            setTimeout(() => {
              const { scrollWidth, clientWidth, scrollLeft } =
                scrollContainer.value || {
                  scrollWidth: 0,
                  clientWidth: 0,
                  scrollLeft: 0,
                }
              const maxScroll = scrollWidth - clientWidth
              thumbPosition.value = (scrollLeft / maxScroll) * MAX_SCROLL_VALUE
            }, 300)
          }
        })
      }

      let observer = new IntersectionObserver(changeThumbPosition, {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      })

      if (element) observer.observe(element)
      element?.scrollIntoView({ behavior: "smooth", inline: "center" })
    })
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.tabs {
  @apply flex;
  @apply whitespace-nowrap;
  @apply overflow-auto;
  @apply flex-shrink-0;
  @apply after:absolute;
  @apply after:inset-x-0;
  @apply after:bottom-0;
  @apply after:bg-dividerLight;
  @apply after:z-10;
  @apply after:h-0.25;
  @apply after:content-[""];

  .tab {
    @apply relative;
    @apply flex;
    @apply p-2;
    @apply font-semibold;
    @apply w-46;
    @apply h-12;
    @apply transition;
    @apply flex-1;
    @apply items-center;
    @apply justify-between;
    @apply text-secondaryLight;
    @apply hover:bg-primaryDark;
    @apply hover:text-secondary;
    @apply focus-visible:text-secondaryDark;
    @apply before:absolute;
    @apply before:left-0;
    @apply before:right-0;
    @apply before:top-0;
    @apply before:bg-transparent;
    @apply before:z-[2];
    @apply before:h-0.5;
    @apply before:content-[""];
    @apply focus:before:bg-divider;

    &.active {
      @apply text-secondaryDark;
      @apply bg-primary;
      @apply before:bg-accent;
      @apply after:absolute;
      @apply after:inset-x-0;
      @apply after:bottom-0;
      @apply after:bg-primary;
      @apply after:z-[12];
      @apply after:h-0.25;
      @apply after:content-[""];
    }

    .close {
      @apply opacity-50;

      &.active {
        @apply opacity-100;
      }
    }
  }
}

.create-new-tab {
  @apply after:absolute;
  @apply after:inset-x-0;
  @apply after:bottom-0;
  @apply after:bg-dividerLight;
  @apply after:z-[14];
  @apply after:h-0.25;
  @apply after:content-[""];
}

$slider-height: 4px;

.slider {
  --thumb-width: 0;

  height: $slider-height;

  @apply appearance-none;
  @apply w-full;
  @apply bg-transparent;
  @apply outline-none;
  @apply opacity-0;
  @apply transition;

  &::-webkit-slider-thumb {
    @apply appearance-none;
    @apply min-w-0;
    @apply bg-dividerDark;
    @apply hover:bg-secondaryLight;
    @apply active:bg-secondaryLight;

    width: var(--thumb-width);
    height: $slider-height;
  }

  &::-moz-range-thumb {
    @apply appearance-none;
    @apply min-w-0;
    @apply bg-dividerDark;
    @apply hover:bg-secondaryLight;
    @apply active:bg-secondaryLight;

    width: var(--thumb-width);
    height: $slider-height;
  }
}

.group-tabs:hover .slider {
  @apply opacity-100;
}
</style>
