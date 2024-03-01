<template>
  <Story title="Table">
    <Variant title="General">
      <HoppSmartTable
        :headings="headings"
        :list="finalList"
        :checkbox="true"
        :selected-rows="selectedRows"
        :pagination="{ totalPages: 2 }"
        @page-number="handlePageChange"
      >
      </HoppSmartTable>
    </Variant>

    <!-- Custom implementation of the Table -->
    <Variant title="Custom">
      <HoppSmartTable :list="finalList">
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

    <!-- Extending the Table functionality -->
    <Variant title="Extension">
      <HoppSmartTable
        :headings="headings"
        :list="extensionList"
        :checkbox="true"
        :selected-rows="selectedRows"
        :sort="{ key: 'name', direction: sortDirection }"
        @page-number="handlePageChange"
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
import { HoppSmartTable } from "../components/smart"

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

const finalList = ref<List[]>([])
const selectedRows = ref<List[]>([])

const primaryList: List[] = [
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

const secondaryList: List[] = [
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
  finalList.value = primaryList
})

const handlePageChange = (pageNumber: number) => {
  if (pageNumber === 1) {
    finalList.value = primaryList
  } else {
    finalList.value = secondaryList
  }
}

const sortDirection: Ref<Direction> = ref("ascending")

const toggleSortDirection = () => {
  sortDirection.value =
    sortDirection.value === "ascending" ? "descending" : "ascending"
}

const searchQuery = ref("")

const extensionList = computed(() => {
  return primaryList.filter((item) => {
    return Object.values(item).some((value) =>
      value
        .toString()
        .toLowerCase()
        .includes((searchQuery.value as string).toLowerCase()),
    )
  })
})
</script>
