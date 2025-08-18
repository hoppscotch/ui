<template>
  <div ref="dropdownRef" class="relative">
    <div class="flex items-center w-25 px-4 py-2 border rounded cursor-pointer" @click="toggleDropdown">
      <span class="flex-grow">{{ selectedItem || placeholder }}</span>
      <span class="ml-2">&#9662;</span> <!-- Arrow symbol -->
    </div>
    <div 
      v-if="isOpen" 
      class="absolute w-25 mt-1 bg-white border rounded shadow-lg"
    >
      <input 
        type="text" 
        v-model="searchTerm" 
        @input="onSearch" 
        :placeholder="searchPlaceholder"
        class="w-full px-4 py-2 border-b border-gray-300 rounded-t"
      />
      <ul>
        <li 
          v-for="(item, index) in filteredItems" 
          :key="index" 
          @mousedown.prevent="selectItem(item)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          {{ item }}
        </li>
        <li v-if="filteredItems.length === 0" class="px-4 py-2 text-gray-500">
          No results found
        </li>
      </ul>
    </div>
    <input 
      type="text" 
      v-model="inputValue" 
      @input="onInput" 
      @focus="isOpen = true"
      @blur="onBlur"
      :placeholder="placeholder"
      class="hidden"  
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  items: string,
  placeholder?: string,
  searchPlaceholder?: string,
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an item',
  searchPlaceholder: 'Search...',
  modelValue: ''
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const inputValue = ref(props.modelValue || '')
const selectedItem = ref<string | null>(props.modelValue || null)
const dropdownRef = ref<HTMLElement | null>(null)
const searchTerm = ref('')

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchTerm.value = '' // Reset search term to show all items
  }
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  emits('update:modelValue', inputValue.value)
}

const selectItem = (item: string) => {
  inputValue.value = item
  selectedItem.value = item
  emits('update:modelValue', item)
  isOpen.value = false
}

const onBlur = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 100)
}

// Handle clicks outside the component to close the dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for changes in `modelValue` and update `selectedItem`
watch(() => props.modelValue, (newVal) => {
  selectedItem.value = newVal
})

const filteredItems = computed(() => {
  const itemsArray = props.items.split(',').map(item => item.trim()).filter(item => item)
  if (searchTerm.value) {
    return itemsArray.filter(item => item.toLowerCase().includes(searchTerm.value.toLowerCase()))
  }
  return itemsArray
})

const onSearch = () => {
  // This function can be used for additional actions on search input if needed
}
</script>

<style lang="scss" scoped>
.relative {
  position: relative;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.w-25 {
  width: 25%;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.border {
  border-width: 1px;
}
.rounded {
  border-radius: 0.25rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.bg-white {
  background-color: white;
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.absolute {
  position: absolute;
}
.cursor-pointer {
  cursor: pointer;
}
.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}
.text-gray-500 {
  color: #6b7280;
}
.ml-2 {
  margin-left: 0.5rem;
}
.hidden {
  display: none;
}
.w-full {
  width: 100%;
}
.border-b {
  border-bottom-width: 1px;
}
</style>
