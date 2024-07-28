<template>
    <nav class="breadcrumb-container">
      <ul class="breadcrumb-list">
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="index"
          :class="{ 'breadcrumb-current': index === breadcrumbItems.length - 1 }"
          class="breadcrumb-item"
        >
          <a
            :href="`#${item.toLowerCase().replace(/\s+/g, '-')}`"
            :class="{ 'breadcrumb-link': index !== breadcrumbItems.length - 1, 'breadcrumb-current': index === breadcrumbItems.length - 1 }"
          >
            {{ item }}
          </a>
          <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb-separator">
            <svg
              fill="#000000"
              height="16px"
              width="16px"
              viewBox="0 0 330 330"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
                c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
                C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
                C255,161.018,253.42,157.202,250.606,154.389z"
              />
            </svg>
          </span>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps({
    items: {
      type: String,
      default: 'Home,Components,BreadCrumb',
    },
  });
  
  const breadcrumbItems = computed(() => {
    return props.items.split(',').map((item) => item.trim());
  });
  </script>
  
  <style scoped>
  .breadcrumb-container {
    display: flex;
    align-items: center;
  }
  
  .breadcrumb-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .breadcrumb-item {
    display: flex;
    align-items: center;
    padding: 0 5px;
  }
  
  .breadcrumb-link {
    text-decoration: none;
    color: inherit;
  }
  
  .breadcrumb-current {
    color: rgb(18, 185, 129);
  }
  
  .breadcrumb-separator {
    display: flex;
    align-items: center;
    margin: 0 5px;
  }
  </style>
  