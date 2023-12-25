<template>
  <Story title="Table">
    <Variant title="General">
      <HoppSmartTable :list="list" :headings="headings" />
    </Variant>
    <Variant title="Custom">
      <HoppSmartTable>
        <template #head>
          <tr
            class="text-sm text-left border-b border-dividerDark bg-primaryLight text-secondary"
          >
            <th
              v-for="heading in headings"
              :key="heading.key"
              scope="col"
              class="px-6 py-3"
            >
              {{ heading.label }}
            </th>
          </tr>
        </template>

        <template #body>
          <tr
            v-for="item in list"
            :key="item.id"
            class="rounded-xl text-secondaryDark hover:cursor-pointer hover:bg-divider"
          >
            <td
              v-for="cellHeading in headings"
              :key="cellHeading.key"
              class="max-w-[10rem] py-1 pl-6"
            >
              {{ item[cellHeading.key] ?? "-" }}
            </td>
          </tr>
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
    id: "123455",
    name: "Joel",
    members: 10,
    role: "Frontend Engineer",
  },
  {
    id: "123456",
    name: "Anwar",
    members: 12,
    role: "Frontend Engineer",
  },
]
</script>
