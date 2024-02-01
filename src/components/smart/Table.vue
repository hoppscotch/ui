<template>
  <div class="overflow-auto rounded-md border border-dividerDark shadow-md">
    <input
      v-if="search"
      v-model="searchQuery"
      class="w-full bg-primary p-3"
      placeholder="Search"
    />

    <table class="w-full">
      <thead>
        <slot name="head">
          <tr
            class="border-b border-dividerDark bg-primaryLight text-left text-sm text-secondary"
          >
            <th v-if="checkbox" class="pl-6 pt-1">
              <input
                ref="selectAllCheckbox"
                type="checkbox"
                @click.stop="toggleAllRows"
              />
            </th>
            <th v-for="th in headings" scope="col" class="px-6 py-3">
              {{ th.label ?? th.key }}
            </th>
          </tr>
        </slot>
      </thead>

      <tbody class="divide-y divide-divider">
        <slot name="body" :list="list">
          <tr
            v-for="(rowData, rowIndex) in finalList"
            :key="rowIndex"
            class="rounded-xl text-secondaryDark hover:cursor-pointer hover:bg-divider"
            :class="{ 'divide-x divide-divider': showYBorder }"
          >
            <td v-if="checkbox" class="my-auto pl-6">
              <input
                v-model="isAllRowsSelected"
                type="checkbox"
                @click.stop="toggleRow(rowData)"
              />
            </td>
            <td
              v-for="cellHeading in headings"
              :key="cellHeading.key"
              @click="!cellHeading.preventClick && onRowClicked(rowData)"
              class="max-w-[10rem] py-1 pl-6"
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
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core"
import { Ref, computed, onMounted, ref, watch } from "vue"

export type CellHeading = {
  key: string
  label?: string
  preventClick?: boolean
}

export type Item = Record<string, unknown>

const props = withDefaults(
  defineProps<{
    /** Whether to show the vertical border between columns */
    showYBorder?: boolean
    /**  The list of items to be displayed in the table */
    list: Item[]
    /** The headings of the table */
    headings?: CellHeading[]
    /** Whether to show the search bar */
    search?: boolean
    /** Whether to show the checkbox column
     * This will be overriden if custom implementation for body slot is provided
     */
    checkbox?: boolean
    /** Whether to enable sorting */
    sort?: {
      key: string
      direction: Direction
    }
  }>(),
  {
    showYBorder: false,
    search: false,
    checkbox: false,
    sort: undefined,
  },
)

const emit = defineEmits<{
  (event: "onRowClicked", item: Item): void
  (event: "onRowToggled", selectedRows: Item[]): void
  (event: "update:list", list: Item[]): void
  (event: "search", query: string): void
}>()

// Final List after performing operations like sort, etc
const finalList = useVModel(props, "list", emit)

const onRowClicked = (item: Item) => emit("onRowClicked", item)

// Search functionality
const searchQuery = ref("")
watch(searchQuery, () => emit("search", searchQuery.value))

// Checkbox functionality
const selectedRows: Ref<Item[]> = ref([])

onMounted(() => {
  if (props.checkbox) {
    console.log(props.checkbox)

    finalList.value = finalList.value.map((item) => ({
      ...item,
      selected: false,
    }))
  }
})

const toggleRow = (item: Item) => {
  item.selected = !item.selected
  console.log(item)
  selectedRows.value = item.selected
    ? [...selectedRows.value, item]
    : selectedRows.value.filter((row) => row !== item)
  emit("onRowToggled", selectedRows.value)
}

const selectAllCheckbox = ref<HTMLInputElement | null>(null)

const isAllRowsSelected = computed(() => {
  return (
    finalList.value.length > 0 &&
    selectedRows.value.length === finalList.value.length
  )
})

const toggleAllRows = () => {
  const isChecked = selectAllCheckbox.value?.checked
  finalList.value.forEach((item) => (item.selected = isChecked))
  selectedRows.value = isChecked ? finalList.value : []
  console.log(finalList.value)
  console.log(selectedRows.value)
  emit("onRowToggled", selectedRows.value)
}

watch(isAllRowsSelected, (newValue) => {
  console.log("isAllRowsSelected", newValue)
})

// Sort List by key and direction which can set to ascending or descending
export type Direction = "ascending" | "descending"

const sortList = (key: string, direction: Direction) => {
  finalList.value = finalList.value?.sort((a, b) => {
    const valueA = a[key] as string
    const valueB = b[key] as string
    return direction === "ascending"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA)
  })
}

onMounted(() => {
  if (props.sort) {
    sortList(props.sort.key, props.sort.direction)
  }
})
</script>
