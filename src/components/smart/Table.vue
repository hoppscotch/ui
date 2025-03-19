<template>
  <div class="overflow-auto rounded-md border border-dividerDark shadow-md">
    <!-- An Extension Slot to extend the table functionality such as search   -->
    <slot name="extension"></slot>

    <table class="w-full table-fixed">
      <thead>
        <tr
          class="border-b border-dividerDark bg-primaryLight text-left text-sm text-secondary"
        >
          <th v-if="selectedRows" class="w-24">
            <input
              ref="selectAllCheckbox"
              type="checkbox"
              :checked="areAllRowsSelected"
              :disabled="loading"
              class="flex h-full w-full items-center justify-center"
              @click.stop="toggleAllRows"
            />
          </th>
          <slot name="head">
            <th
              v-for="th in headings"
              :key="th.key"
              scope="col"
              class="px-6 py-3"
            >
              {{ th.label ?? th.key }}
            </th>
          </slot>
        </tr>
      </thead>

      <tbody class="divide-y divide-divider">
        <tr v-if="loading">
          <slot name="loading-state">
            <td :colspan="columnSpan">
              <div class="mx-auto my-3 h-5 w-5 text-center">
                <HoppSmartSpinner />
              </div>
            </td>
          </slot>
        </tr>

        <tr v-else-if="!list.length">
          <slot name="empty-state">
            <td :colspan="columnSpan" class="py-3 text-center">
              <p>No data available</p>
            </td>
          </slot>
        </tr>

        <template v-else>
          <tr
            v-for="(rowData, rowIndex) in workingList"
            :key="rowIndex"
            class="rounded-xl text-secondaryDark hover:cursor-pointer hover:bg-divider"
            :class="[
              { 'divide-x divide-divider': showYBorder },
              getRowCustomStyle(rowData),
            ]"
            @click="onRowClicked(rowData)"
          >
            <td v-if="selectedRows">
              <input
                type="checkbox"
                :checked="isRowSelected(rowData)"
                class="flex h-full w-full items-center justify-center"
                @click.stop="toggleRow(rowData)"
              />
            </td>
            <slot name="body" :row="rowData">
              <td
                v-for="cellHeading in headings"
                :key="cellHeading.key"
                class="px-4 py-2"
                @click="!cellHeading.preventClick && onRowClicked(rowData)"
              >
                <!-- Dynamic column slot -->
                <slot :name="cellHeading.key" :item="rowData">
                  <!-- Generic implementation of the column -->
                  <div class="flex flex-col truncate">
                    <span class="truncate">
                      {{ rowData[cellHeading.key] ?? "-" }}
                    </span>
                  </div>
                </slot>
              </td>
            </slot>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core"
import { isEqual } from "lodash-es"
import { computed, ref, watch, watchEffect } from "vue"
import HoppSmartSpinner from "./Spinner.vue"

export type CellHeading = {
  key: string
  label?: string
  preventClick?: boolean
}

export type RowStyle = {
  classes?: string
  style?: Record<string, string>
}

export type Item<T = Record<string, unknown>> = T

const props = withDefaults(
  defineProps<{
    // Whether to show vertical borders between cells
    showYBorder?: boolean

    // List of items to be displayed in the table
    list: Item<any>[]

    // Headings for the table
    headings?: CellHeading[]

    // Currently selected rows
    selectedRows?: Item<any>[]

    // Sorting configurations
    sort?: {
      key: string
      direction: Direction
    }

    // Whether the table is in loading state
    loading?: boolean

    /**
     * Custom styles for rows:
     * - Object: key-based (determined by getRowStyleKey)
     * - String: applied as CSS class to all rows
     */
    rowStyles?: Record<string, RowStyle> | string
    /**
     * Function to determine which row style to apply
     * Returns rowStyles directly if it's a string
     * R eturns a key that exists in rowStyles (when rowStyles is an object), or null if no style should be applied
     */
    getRowStyleKey?: (rowData: Item<any>) => string | null
  }>(),
  {
    showYBorder: false,
    sort: undefined,
    selectedRows: undefined,
    loading: false,
    rowStyles: () => ({}),
    getRowStyleKey: () => null,
  },
)

const emit = defineEmits<{
  (event: "onRowClicked", item: Item<any>): void
  (event: "update:list", list: Item<any>[]): void
  (event: "update:selectedRows", selectedRows: Item<any>[]): void
}>()

const workingList = useVModel(props, "list", emit)
const selectedRows = useVModel(props, "selectedRows", emit)

watch(workingList.value, (updatedList) => {
  if (props.selectedRows) {
    updatedList = updatedList.map((item) => ({
      ...item,
      selected: false,
    }))
  }
})

const onRowClicked = (item: Item<any>) => emit("onRowClicked", item)

const isRowSelected = (item: Item<any>) => {
  const { selected, ...data } = item
  return selectedRows.value?.some((row) => isEqual(row, data))
}

const toggleRow = (item: Item<any>) => {
  item.selected = !item.selected
  const { selected, ...data } = item

  const index = selectedRows.value?.findIndex((row) => isEqual(row, data)) ?? -1

  if (item.selected && !isRowSelected(data)) {
    selectedRows.value!.push(data)
  } else if (index !== -1) {
    selectedRows.value?.splice(index, 1)
  }
}

const selectAllCheckbox = ref<HTMLInputElement | null>(null)

const toggleAllRows = () => {
  const isChecked = selectAllCheckbox.value?.checked
  workingList.value.forEach((item) => {
    item.selected = isChecked
    const { selected, ...data } = item
    if (isChecked) {
      if (!isRowSelected(item)) {
        selectedRows.value!.push(data)
      }
      return
    }
    const index =
      selectedRows.value?.findIndex((row) => isEqual(row, data)) ?? -1
    selectedRows.value!.splice(index, 1)
  })
}

const areAllRowsSelected = computed(() => {
  if (workingList.value.length === 0 || selectedRows.value?.length === 0)
    return false
  return workingList.value.every((item) => {
    const { selected, ...data } = item
    return selectedRows.value?.some((row) => isEqual(row, data))
  })
})

watchEffect(() => {
  if (selectedRows.value?.length === 0) {
    workingList.value.forEach((item) => {
      item.selected = false
    })
  }
})

const getRowCustomStyle = (rowData: Item<any>) => {
  if (typeof props.rowStyles === "string") {
    return props.rowStyles
  }

  const styleKey = props.getRowStyleKey?.(rowData)
  if (!styleKey || !props.rowStyles[styleKey]) return ""
  return props.rowStyles[styleKey].classes || ""
}

export type Direction = "ascending" | "descending"

const sortList = (key: string, direction: Direction) => {
  workingList.value.sort((a, b) => {
    const valueA = a[key] as string
    const valueB = b[key] as string
    return direction === "ascending"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA)
  })
}

watch(
  () => props.sort?.direction,
  () => {
    if (props.sort) {
      sortList(props.sort.key, props.sort.direction)
    }
  },
  { immediate: true },
)

const columnSpan = computed(
  () => (props.headings?.length ?? 0) + (props.selectedRows ? 1 : 0),
)
</script>
