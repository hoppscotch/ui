<template>
  <Story title="Table">
    <Variant title="General">
      <div class="mb-3">
        <p class="mb-1 text-sm">
          This example demonstrates how to implement a table with default
          configurations
        </p>
      </div>
      <HoppSmartTable
        :headings="headings"
        :loading="loading"
        :list="list"
        :selected-rows="selectedRows"
      />
    </Variant>

    <!-- Custom implementation of the Table -->
    <Variant title="Custom">
      <div class="mb-3">
        <p class="mb-1 text-sm">
          This example demonstrates how to use the table component with custom
          configurations
        </p>
      </div>
      <HoppSmartTable :loading="loading" :list="list">
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

        <template #loading-state>
          <td :colspan="headings.length">
            <div class="mx-auto my-3 h-5 w-5 text-center">
              <HoppSmartSpinner />
            </div>
          </td>
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

        <template #empty-state>
          <td :colspan="headings.length" class="py-3 text-center">
            <p>No data available</p>
          </td>
        </template>
      </HoppSmartTable>
    </Variant>

    <!-- Custom Row Styles -->
    <Variant title="Custom Row Styles">
      <div class="mb-3">
        <p class="mb-1 text-sm">
          This example demonstrates how to customize row styles based on data:
        </p>
        <ul class="list-disc pl-5 text-xs">
          <li>
            Rows with members > 10 are highlighted in
            <span class="text-green-500">green</span>
          </li>
          <li>
            Rows with role containing "Lab" are highlighted in
            <span class="text-yellow-500">yellow</span>
          </li>
        </ul>
      </div>
      <HoppSmartTable
        :headings="headings"
        :list="list"
        :row-styles="rowStyles"
        :get-row-style-key="getRowStyleKey"
      />
    </Variant>

    <!-- Extending the Table functionality -->
    <Variant title="Extension">
      <div class="mb-3">
        <p class="mb-1 text-sm">
          This example demonstrates how to extend the table functionality:
        </p>
        <ul class="list-disc pl-5 text-xs">
          <li>
            Added a search functionality to filter rows based on the search
            query
          </li>
          <li>
            Added a sort functionality to sort rows based on the name column
          </li>
        </ul>
      </div>
      <HoppSmartTable
        :headings="headings"
        :loading="loading"
        :list="extensionList"
        :selected-rows="selectedRows"
        :sort="{ key: 'name', direction: sortDirection }"
      >
        <template #extension>
          <div class="flex">
            <div class="flex w-full items-center bg-primary">
              <icon-lucide-search class="mx-3 text-xs" />
              <HoppSmartInput
                v-model="searchQuery"
                styles="w-full bg-primary py-1"
                input-styles="h-full border-none"
                placeholder="Search.."
              />
            </div>
            <HoppButtonPrimary
              :icon="IconArrowUpDown"
              label="Sort"
              class="rounded-none"
              @click="toggleSortDirection"
            />
          </div>
        </template>
      </HoppSmartTable>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue"
import { CellHeading, Direction } from "~/components/smart/Table.vue"
import IconArrowUpDown from "~icons/lucide/arrow-up-down"
import { HoppButtonPrimary, HoppSmartInput } from ".."
import { HoppSmartSpinner, HoppSmartTable } from "../components/smart"

type List = {
  id: string
  name: string
  members: number
  role: string
}

// Table Headings
const headings: CellHeading[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
  { key: "role", label: "Role" },
]

const loading = ref(false)

const selectedRows = ref<List[]>([])

const list: List[] = [
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

onMounted(async () => {
  loading.value = true

  // Simulate network call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  loading.value = false
})

const sortDirection: Ref<Direction> = ref("ascending")

const toggleSortDirection = () => {
  sortDirection.value =
    sortDirection.value === "ascending" ? "descending" : "ascending"
}

const searchQuery = ref("")

const extensionList = computed(() => {
  return list.filter((item) => {
    return Object.values(item).some((value) =>
      value
        .toString()
        .toLowerCase()
        .includes((searchQuery.value as string).toLowerCase()),
    )
  })
})

// Custom Row Styles
const rowStyles = {
  majorityMembers: {
    classes: "bg-green-400 text-green-900 hover:bg-green-200",
  },
  labRole: {
    classes: "bg-yellow-300 text-yellow-900 hover:bg-yellow-100",
  },
}

const getRowStyleKey = (row: List) => {
  if (row.members > 10) return "majorityMembers"
  if (row.role.includes("Lab")) return "labRole"
  return null
}
</script>
