<template>
  <div class="dropdown-container" :class="{ open: isOpen }">
    <div class="dropdown-trigger" @click="toggleDropdown">
      <slot name="button">
        <button>{{ title }}</button>
        <span class="dropdown-arrow">▼</span>
      </slot>
    </div>
    <div v-if="isOpen" class="dropdown-content">
      <slot name="content">
        <p>Dropdown content</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

defineProps({
  title: {
    type: String,
    default: "Dropdown menu",
  },
})

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.dropdown-container {
  position: relative;
  display: 100%;
}

.dropdown-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: #fff;
  cursor: pointer;
  background-color: #333;
}

.dropdown-arrow {
  transition: transform 0.3s;
}

.open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 10px;
  padding: 10px;
  background-color: #1e1e1e;
  border: 1px solid #333;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
