<template>
  <div class="overflow-auto border shadow-md rounded-md border-dividerDark">
    <table class="w-full">
      <thead>
        <slot name="head">
          <tr
            class="text-sm text-left border-b border-dividerDark bg-primaryLight text-secondary"
          >
            <th v-for="th in headings" scope="col" class="px-6 py-3">
              {{ th.label ?? th.key }}
            </th>
          </tr>
        </slot>
      </thead>

      <tbody class="divide-y divide-divider">
        <!-- We are using slot props for future proofing so that in future, we can implement features like filtering -->
        <slot name="body" :list="list">
          <tr
            v-for="(rowData, rowIndex) in list"
            :key="rowIndex"
            class="rounded-xl text-secondaryDark hover:cursor-pointer hover:bg-divider"
            :class="{ 'divide-x divide-divider': showYBorder }"
          >
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

<script lang="ts" setup generic="Item extends Record<string, unknown>">
export type CellHeading = {
  key: string
  label?: string
  preventClick?: boolean
}

defineProps<{
  /** Whether to show the vertical border between columns */
  showYBorder?: boolean
  /**  The list of items to be displayed in the table */
  list?: Item[]
  /** The headings of the table */
  headings?: CellHeading[]
}>()

const emit = defineEmits<{
  (event: "onRowClicked", item: Item): void
}>()

const onRowClicked = (item: Item) => emit("onRowClicked", item)
</script>
