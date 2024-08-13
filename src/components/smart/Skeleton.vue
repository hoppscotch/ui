<template>
  <div
    :style="{ backgroundColor: bgColor }"
    class="flex flex-col gap-y-4 rounded-md p-4"
  >
    <div
      v-if="showImage"
      :style="{
        backgroundColor: skeletonColor,
        width: imageWidth,
        height: imageHeight,
        order: orderMap.image,
      }"
      class="relative rounded-md"
    >
      <!-- Mountain triangle design for image placeholder -->
      <svg
        v-if="showImage"
        class="absolute inset-0 h-full w-full text-gray-300"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill-rule="evenodd" d="M2 20h20L12 4 2 20z" clip-rule="evenodd" />
      </svg>
    </div>
    <div v-if="showText" class="space-y-2" :style="{ order: orderMap.text }">
      <div
        :style="{
          backgroundColor: skeletonColor,
          width: textWidthFirst,
          height: `${textHeight}`,
        }"
        class="rounded-md"
      ></div>
      <div
        v-for="n in textLines"
        :key="n"
        :style="{
          backgroundColor: skeletonColor,
          width: textWidth,
          height: `${textHeight}`,
        }"
        class="rounded-md"
      ></div>
    </div>
    <div
      v-if="showVideo"
      :style="{
        backgroundColor: skeletonColor,
        width: videoWidth,
        height: videoHeight,
        order: orderMap.video,
      }"
      class="relative flex items-center justify-center rounded-md"
    >
      <!-- Play button SVG for video placeholder -->
      <svg
        v-if="showVideo"
        fill="#000000"
        height="48px"
        width="48px"
        viewBox="0 0 60 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"
        />
        <path
          d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    bgColor: string
    skeletonColor: string
    showImage: boolean
    showText: boolean
    showVideo: boolean
    imageWidth: string
    imageHeight: string
    textWidthFirst: string
    textWidth: string
    textHeight: string
    textTotalHeight: string
    videoWidth: string
    videoHeight: string
    orders: string
  }>(),
  {
    bgColor: "#f3f4f6", // Default background color
    skeletonColor: "#e1e1e1", // Default skeleton color
    showImage: false, // Toggle for showing image skeleton
    showText: false, // Toggle for showing text skeleton
    showVideo: false, // Toggle for showing video skeleton
    imageWidth: "100%", // Default image width
    imageHeight: "150px", // Default image height
    textWidthFirst: "25%", // Default text width of first line
    textWidth: "75%", // Default text width
    textHeight: "20px", // Default text height
    textTotalHeight: "40px", // Default total text height
    videoWidth: "100%", // Default video width
    videoHeight: "200px", // Default video height
    orders: "text image video", // Default order of elements
  },
)

const textLines = computed(() => {
  const totalHeight = parseFloat(props.textTotalHeight)
  const lineHeight = parseFloat(props.textHeight)
  return Math.floor((totalHeight - lineHeight) / lineHeight)
})

const orderMap = computed(() => {
  const orderArray = props.orders.split(" ")
  // TODO: fix this any type
  const map: any = {
    text: 0,
    image: 1,
    video: 2,
  }
  orderArray.forEach((element, index) => {
    map[element] = index
  })
  return map
})
</script>

<style scoped>
div {
  @apply animate-pulse;
}
</style>
