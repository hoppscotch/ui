<template>
  <div class="flex flex-1 flex-col">
    <div
      v-if="rootNodes.status === 'loaded' && rootNodes.data.length > 0"
      class="flex flex-col"
    >
      <div
        v-for="rootNode in rootNodes.data"
        :key="rootNode.id"
        class="flex flex-1 flex-col"
      >
        <SmartTreeBranch
          :root-nodes-length="rootNodes.data.length"
          :node-item="rootNode"
          :expand-all="expandAll"
          :adapter="adapter as SmartTreeAdapter<T>"
        >
          <template
            #default="{ node, toggleChildren, isOpen, highlightChildren }"
          >
            <slot
              name="content"
              :node="node as TreeNode<T>"
              :toggle-children="toggleChildren as () => void"
              :is-open="isOpen as boolean"
              :highlight-children="(id: string | null) => highlightChildren(id)"
            ></slot>
          </template>

          <template #emptyNode="{ node }">
            <slot name="emptyNode" :node="node"></slot>
          </template>
        </SmartTreeBranch>
      </div>
    </div>
    <div
      v-else-if="rootNodes.status === 'loading'"
      class="flex flex-1 flex-col items-center justify-center p-4"
    >
      <SmartSpinner class="my-4" />
      <span class="text-secondaryLight">{{ t?.("state.loading") }}</span>
    </div>
    <div
      v-if="rootNodes.status === 'loaded' && rootNodes.data.length === 0"
      class="flex flex-1 flex-col"
    >
      <!-- eslint-disable-next-line vue/no-deprecated-filter -->
      <slot name="emptyNode" :node="null as TreeNode<T> | null"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends any">
import { inject } from "vue"
import SmartTreeBranch from "./TreeBranch.vue"
import SmartSpinner from "./Spinner.vue"
import { SmartTreeAdapter, TreeNode } from "~/helpers/treeAdapter"
import { HOPP_UI_OPTIONS, HoppUIPluginOptions } from "./../../plugin"
const { t } = inject<HoppUIPluginOptions>(HOPP_UI_OPTIONS) ?? {}

const props = defineProps<{
  /**
   * The adapter that will be used to fetch the tree data
   * @template T The type of the data that will be stored in the tree
   */
  adapter: SmartTreeAdapter<T>
  /**
   *  open by default
   */
  expandAll?: boolean
}>()

/**
 * Fetch the root nodes from the adapter by passing the node id as null
 */
const rootNodes = props.adapter.getChildren(null)
</script>
