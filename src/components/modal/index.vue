<template>
  <dialog ref="dialog">
    <Transition name="fade" appear @leave="onTransitionLeaveStart">
      <div
        ref="modal"
        class="fixed inset-0 z-[1000] overflow-y-auto transition"
        role="dialog"
      >
        <div
          class="flex min-h-screen items-end justify-center text-center sm:!block"
        >
          <Transition name="fade" appear>
            <div
              class="fixed inset-0 transition-opacity"
              @touchstart="!dialog ? close() : null"
              @touchend="!dialog ? close() : null"
              @mouseup="!dialog ? close() : null"
              @mousedown="!dialog ? close() : null"
            >
              <div
                class="absolute inset-0 bg-primaryLight opacity-80 focus:outline-none"
                tabindex="0"
                @click="!dialog ? close() : null"
              ></div>
            </div>
          </Transition>
          <span
            v-if="placement === 'center'"
            class="sm:h-screen sm:align-middle <sm:hidden"
            aria-hidden="true"
            >&#8203;</span
          >
          <Transition name="bounce" appear>
            <div
              class="inline-block w-full transform overflow-hidden border-dividerDark bg-primary text-left align-bottom shadow-lg transition-all sm:rounded-xl sm:border sm:align-middle"
              :class="[{ 'mt-16 md:mb-8': placement === 'top' }, styles]"
            >
              <Heading
                :title="title"
                :show-close-icon="dimissible"
                :close-text="closeText"
                @close="close"
              />

              <div
                class="flex max-h-[60vh] flex-col overflow-y-auto"
                :class="{ 'p-4': !fullWidth && !fullWidthBody }"
              >
                <slot name="body"></slot>
              </div>
              <div
                v-if="hasFooterSlot"
                class="flex flex-1 items-center justify-between border-t border-dividerLight bg-primaryContrast"
                :class="{ 'p-4': !fullWidth }"
              >
                <slot name="footer"></slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </dialog>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
} from "vue"
import { HOPP_UI_OPTIONS, HoppUIPluginOptions } from "./../../plugin"
import Heading from "./Heading.vue"

const { onModalOpen, onModalClose } =
  inject<HoppUIPluginOptions>(HOPP_UI_OPTIONS) ?? {}

withDefaults(
  defineProps<{
    dialog?: boolean
    title?: string
    dimissible?: boolean
    placement?: string
    fullWidth?: boolean
    fullWidthBody?: boolean
    styles?: string
    closeText?: string | null
  }>(),
  {
    dialog: false,
    title: "",
    dimissible: true,
    placement: "top",
    fullWidth: false,
    fullWidthBody: false,
    styles: "sm:max-w-lg",
    closeText: null,
  },
)

const emit = defineEmits<{
  (e: "close"): void
}>()

onBeforeUnmount(() => {
  onModalClose?.()
})

const shouldCleanupDomOnUnmount = ref(true)

const slots = useSlots()

const hasFooterSlot = computed(() => {
  return !!slots.footer
})

const dialog = ref<HTMLDialogElement>()

onMounted(() => {
  dialog.value?.showModal()
  onModalOpen?.()
})

onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeyDown)
})

const close = () => {
  emit("close")
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.preventDefault()
    close()
  }
}

const onTransitionLeaveStart = () => {
  close()
  shouldCleanupDomOnUnmount.value = false
}
</script>

<style lang="scss" scoped>
.bounce-enter-active {
  @apply transition;
  animation: bounce-in 150ms;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}
</style>
