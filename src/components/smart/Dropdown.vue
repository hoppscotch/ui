<template>
  <div class="dropdown-container">
    <div class="dropdown-header" @click="toggleDropdown">
      {{ title }}
      <svg
        class="dropdown-arrow"
        :class="{ 'open': isOpen }"
        fill="#fff"
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
    </div>
    <nav v-if="isOpen" class="dropdown-menu">
      <ul class="dropdown-list">
        <li
          v-for="(item, index) in menuItems"
          :key="index"
          class="dropdown-item"
          @click="handleItemClick(item)"
        >
          <a
            :href="`#${item.label.toLowerCase().replace(/\s+/g, '-')}`"
            class="dropdown-link"
          >
            <span v-if="item.icon" class="icon" v-html="item.icon"></span>
            {{ item.label }}
          </a>
          <div v-if="index < menuItems.length - 1" class="separator"></div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Dropdown menu',
  },
  items: {
    type: String,
    default: 'Option1,Option2,Option3',
  },
  icons: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (event: 'item-click', item: { label: string; icon: string | null }): void;
}>();

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const menuItems = computed(() => {
  const items = props.items.split(',').map((item) => item.trim());
  const icons = props.icons ? props.icons.split(',').map((icon) => icon.trim()) : [];
  return items.map((item, index) => ({
    label: item,
    icon: icons[index] || null,
  }));
});

const handleItemClick = (item:any) => {
  emit('item-click', item);
};
</script>

<style scoped>
.dropdown-container {
  border: 1px solid #333;
  background-color: #1e1e1e;
  width: 200px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}

.dropdown-header {
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

.dropdown-arrow.open {
  transform: rotate(90deg);
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  padding: 10px;
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

.dropdown-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.dropdown-item {
  width: 100%;
}

.dropdown-link {
  text-decoration: none;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 0.2s;
}

.dropdown-link:hover {
  background-color: #444;
}

.icon {
  margin-right: 10px;
}

.separator {
  height: 1px;
  background-color: #555;
  width: 100%;
}
</style>
