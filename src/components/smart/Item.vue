<template>
  <HoppSmartLink
    :to="to"
    :exact="exact"
    :blank="blank"
    class="inline-flex flex-shrink-0 items-center rounded px-4 py-2 transition hover:bg-primaryDark hover:text-secondaryDark focus:outline-none focus-visible:bg-primaryDark focus-visible:text-secondaryDark"
    :class="[
      { 'cursor-not-allowed opacity-75': disabled },
      { 'pointer-events-none': loading },
      { 'flex-1': label },
      { 'flex-row-reverse justify-end': reverse },
      {
        'border border-divider hover:border-dividerDark focus-visible:border-dividerDark':
          outline,
      },
    ]"
    :disabled="disabled"
    :tabindex="loading ? '-1' : '0'"
    role="menuitem"
  >
    <span
      v-if="!loading"
      class="inline-flex items-center"
      :class="{ 'self-start': !!infoIcon }"
    >
      <component
        :is="icon"
        v-if="icon"
        class="svg-icons opacity-75"
        :class="[
          label ? (reverse ? 'ml-4' : 'mr-4') : '',
          { 'text-accent': active },
        ]"
        aria-hidden="true"
      />
    </span>
    <HoppSmartSpinner v-else class="mr-4 text-secondaryDark" />
    <div
      class="inline-flex flex-1 items-start truncate"
      :class="{ 'flex-col': description }"
    >
      <div class="max-w-[16rem] truncate font-semibold">
        <span v-if="label">{{ label }}</span>
        <!-- Added span to ensure label text is announced separately -->
      </div>
      <p v-if="description" class="my-2 text-left text-secondaryLight">
        {{ description }}
      </p>
    </div>
    <component
      :is="infoIcon"
      v-if="infoIcon"
      class="svg-icons -mr-2 ml-6 items-center self-center"
      :class="{ 'text-accent': activeInfoIcon }"
      aria-hidden="true"
    />
    <div v-if="shortcut.length" class="ml-4 inline-flex font-medium <sm:hidden">
      <kbd
        v-for="(key, index) in shortcut"
        :key="`key-${index}`"
        class="shortcut-key -mr-2"
      >
        {{ key }}
      </kbd>
    </div>
  </HoppSmartLink>
</template>

<script setup lang="ts">
import HoppSmartLink from "./Link.vue"
import HoppSmartSpinner from "./Spinner.vue"

withDefaults(
  defineProps<{
    to: string
    exact: boolean
    blank: boolean
    label: string
    description: string
    icon: object | null
    svg: object | null
    disabled: boolean
    loading: boolean
    reverse: boolean
    outline: boolean
    shortcut: string[]
    active: boolean
    activeInfoIcon: boolean
    infoIcon: object | null
  }>(),
  {
    to: "",
    exact: true,
    blank: false,
    label: "",
    description: "",
    icon: null,
    svg: null,
    disabled: false,
    loading: false,
    reverse: false,
    outline: false,
    shortcut: [],
    active: false,
    activeInfoIcon: false,
    infoIcon: null,
  },
)
</script>
