<template>
  <Story title="Table">
    <Variant title="General">
      <HoppSmartTable
        :headings="headings"
        :list="list"
        :checkbox="true"
        :pagination="{ totalPages: 10 }"
        :search-bar="{ debounce: 1000, placeholder: 'Search by name' }"
        :sort="{ key: 'name', direction: 'ascending' }"
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
import { HoppSmartTable } from "../components/smart"
import { CellHeading } from "~/components/smart/Table.vue"

// Table Headings
const headings: CellHeading[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "members", label: "Members" },
  { key: "role", label: "Role" },
]

const list: Record<string, string | number>[] = [
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
</script>
