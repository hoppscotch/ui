<template>
  <slot
    :node="nodeItem"
    :toggle-children="toggleNodeChildren"
    :is-open="isNodeOpen"
    :highlight-children="(id: string | null) => highlightNodeChildren(id)"
  ></slot>

  <!-- This is a performance optimization trick -->
  <!-- Once expanded, Vue will traverse through the children and expand the tree up
       but when we collapse, the tree and the components are disposed. This is wasteful
       and comes with performance issues if the children list is expensive to render.
       Hence, here we render children only when first expanded, and after that, even if collapsed,
       we just hide the children.
  -->
  <div v-if="childrenRendered" v-show="showChildren" class="flex">
    <div
      class="ml-[1.375rem] flex w-0.5 transform cursor-nsResize bg-dividerLight transition hover:scale-x-125 hover:bg-dividerDark"
      @click="toggleNodeChildren"
    ></div>
    <div
      v-if="childNodes.status === 'loaded' && childNodes.data.length > 0"
      class="flex flex-1 flex-col truncate"
      :class="{
        'bg-divider': highlightNode,
      }"
    >
      <SmartTreeBranch
        v-for="childNode in childNodes.data"
        :key="`${childNode.id}-${childNode.data.type}`"
        :node-item="childNode"
        :adapter="adapter"
        :expand-all="expandAll"
      >
        <!-- The child slot is given a dynamic name in order to not break Volar -->
        <template
          #[CHILD_SLOT_NAME]="{
            node,
            toggleChildren,
            isOpen,
            highlightChildren,
          }"
        >
          <!-- Casting to help with type checking -->
          <slot
            :node="node as TreeNode<T>"
            :toggle-children="toggleChildren as () => void"
            :is-open="isOpen as boolean"
            :highlight-children="
              (id: string | null) => highlightChildren(id) as void
            "
          ></slot>
        </template>
        <template #emptyNode="{ node }">
          <slot name="emptyNode" :node="node"></slot>
        </template>
      </SmartTreeBranch>
    </div>

    <div
      v-if="childNodes.status === 'loading'"
      class="flex flex-1 flex-col items-center justify-center p-4"
    >
      <SmartSpinner class="my-4" />
      <span class="text-secondaryLight">{{ t?.("state.loading") }}</span>
    </div>
    <div
      v-if="childNodes.status === 'loaded' && childNodes.data.length === 0"
      class="flex flex-1 flex-col"
    >
      <slot name="emptyNode" :node="nodeItem"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends any">
import { computed, inject, onMounted, ref } from "vue"
import SmartTreeBranch from "./TreeBranch.vue"
import SmartSpinner from "./Spinner.vue"
import { SmartTreeAdapter, TreeNode } from "~/helpers/treeAdapter"
import { HOPP_UI_OPTIONS, HoppUIPluginOptions } from "./../../plugin"
const { t } = inject<HoppUIPluginOptions>(HOPP_UI_OPTIONS) ?? {}

const props = withDefaults(
  defineProps<{
    /**
     * The node item that will be used to render the tree branch
     * @template T The type of the data passed to the tree branch
     */
    adapter: SmartTreeAdapter<T>
    /**
     *  The node item that will be used to render the tree branch content
     */
    nodeItem: TreeNode<T>
    /**
     *  Total number of rootNode
     */
    rootNodesLength?: number
    /**
     *  open by default
     */
    expandAll?: boolean
  }>(),
  {
    rootNodesLength: 0,
    expandAll: false,
  },
)

const CHILD_SLOT_NAME = "default"

const isOnlyRootChild = computed(() => props.rootNodesLength === 1)

/**
 * Marks whether the children on this branch were ever rendered
 * See the usage inside '<template>' for more info
 */
const childrenRendered = ref(isOnlyRootChild.value)

const showChildren = ref(isOnlyRootChild.value)
const isNodeOpen = ref(isOnlyRootChild.value)

const highlightNode = ref(false)

/**
 * Fetch the child nodes from the adapter by passing the node id of the current node
 */
const childNodes = props.adapter.getChildren(
  props.nodeItem.id,
  props.nodeItem.data.type,
)

const toggleNodeChildren = () => {
  if (props.expandAll) return
  if (!childrenRendered.value) childrenRendered.value = true

  showChildren.value = !showChildren.value
  isNodeOpen.value = !isNodeOpen.value
}

onMounted(() => {
  if (props.expandAll) {
    childrenRendered.value = true
    showChildren.value = true
    isNodeOpen.value = true
  }
})

const highlightNodeChildren = (id: string | null) => {
  if (id) {
    highlightNode.value = true
  } else {
    highlightNode.value = false
  }
}
</script>
