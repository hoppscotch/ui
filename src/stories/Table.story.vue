<template>
  <Story title="Table">
    <Variant title="General">
      <HoppSmartTable
        :headings="headings"
        :list="list"
        :checkbox="true"
        :spinner="{ enabled: true, duration: 1000 }"
        :selected-rows="selectedRows"
        :pagination="{ totalPages: 2 }"
        :search-bar="{ debounce: 1000, placeholder: 'Search by name' }"
        :sort="{ key: 'name', direction: 'ascending' }"
        @page-number="handlePageChange"
      />
    </Variant>
    <Variant title="Custom">
      <HoppSmartTable :list="list">
        <template #head>
          <th
            v-for="heading in headings"
            :key="heading.key"
            scope="col"
            class="px-6 py-3"
          >
            {{ heading.label }}
          </th>
        </template>

        <template #body="{ row }">
          <td
            v-for="cellHeading in headings"
            :key="cellHeading.key"
            class="max-w-[10rem] py-1 pl-6"
          >
            {{ row[cellHeading.key] ?? "-" }}
          </td>
        </template>
      </HoppSmartTable>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { CellHeading } from "~/components/smart/Table.vue"
import { HoppSmartTable } from "../components/smart"

// Table Headings
const headings: CellHeading[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
  { key: "role", label: "Role" },
]

const list = ref<Record<string, string | number>[]>([])

const firstList = [
  {
    id: "123456",
    name: "Walter",
    members: 12,
    role: "Chemical Engineer",
  },
  {
    id: "123455",
    name: "Jesse",
    members: 10,
    role: "Lab Assistant",
  },
]

const secondList = [
  {
    id: "123457",
    name: "Gus",
    members: 20,
    role: "CEO",
  },
  {
    id: "123458",
    name: "Mike",
    members: 15,
    role: "Security",
  },
]

onMounted(() => {
  list.value = firstList
})

const handlePageChange = (pageNumber: number) => {
  if (pageNumber === 1) {
    list.value = firstList
  } else {
    list.value = secondList
  }
}

const selectedRows = ref<Record<string, string | number>[]>([])
</script>
