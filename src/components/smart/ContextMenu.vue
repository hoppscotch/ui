<template>
    <nav class="context-menu-container">
      <ul class="context-menu-list">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          class="context-menu-item"
        >
          <a
            :href="`#${item.label.toLowerCase().replace(/\s+/g, '-')}`"
            class="context-menu-link"
          >
            <span v-if="item.icon" class="icon" v-html="item.icon"></span>
            {{ item.label }}
          </a>
          <div v-if="index < menuItems.length - 1" class="separator"></div>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps({
    items: {
      type: String,
      default: 'Option1,Option2,Option3',
    },
    icons: {
      type: String,
      default: '',
    },
  });
  
  const menuItems = computed(() => {
    const items = props.items.split(',').map((item) => item.trim());
    const icons = props.icons ? props.icons.split(',').map((icon) => icon.trim()) : [];
    return items.map((item, index) => ({
      label: item,
      icon: icons[index] || null,
    }));
  });
  </script>
  
  <style scoped>
  .context-menu-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid #333;
    background-color: #1e1e1e;
    padding: 10px;
    width: 200px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
  
  .context-menu-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }
  
  .context-menu-item {
    width: 100%;
  }
  
  .context-menu-link {
    text-decoration: none;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    transition: background-color 0.2s;
  }
  
  .context-menu-link:hover {
    background-color: #333;
  }
  
  .icon {
    margin-right: 10px;
  }
  
  .separator {
    height: 1px;
    background-color: #444;
    width: 100%;
  }
  </style>
  