<template>
    <div class="pagination-container">
      <!-- Previous Page Button -->
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
        &laquo;
      </button>
  
      <!-- Page Numbers -->
      <ul class="pagination-list">
        <!-- Show "..." if the current page is far from the beginning -->
        <li v-if="showLeftEllipsis" class="pagination-item">
          <span class="pagination-ellipsis">...</span>
        </li>
  
        <li v-for="page in displayedPages" :key="typeof page === 'number' ? page : 'ellipsis'" :class="{ 'current-page': page === currentPage }" class="pagination-item">
          <!-- Display the page number button or handle ellipsis -->
          <button v-if="typeof page === 'number'" @click="setPage(page)" :class="{ 'active': page === currentPage }" class="pagination-link">
            {{ page }}
          </button>
          <span v-else class="pagination-ellipsis">{{ page }}</span>
        </li>
  
        <!-- Show "..." if the current page is far from the end -->
        <li v-if="showRightEllipsis" class="pagination-item">
          <span class="pagination-ellipsis">...</span>
        </li>
      </ul>
  
      <!-- Next Page Button -->
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
        &raquo;
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 10,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
    forwardRoute: {
      type: String,
      required: true,
    },
    backRoute: {
      type: String,
      required: true,
    },
    routeToPage: {
      type: String,
      required: true,
    }
  });
  
  const emit = defineEmits(['update:currentPage']);
  const router = useRouter();
  
  const currentPage = ref(props.currentPage);
  
  const setPage = (page: number) => {
    currentPage.value = page;
    emit('update:currentPage', page);
    router.push({ path: props.routeToPage.replace(':page', page.toString()) });
  };
  
  const nextPage = () => {
    if (currentPage.value < props.totalPages) {
      setPage(currentPage.value + 1);
    } else {
      router.push({ path: props.forwardRoute });
    }
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      setPage(currentPage.value - 1);
    } else {
      router.push({ path: props.backRoute });
    }
  };
  
  const displayedPages = computed(() => {
    const pages: (number | string)[] = [];
    const maxPagesBeforeCurrent = 2;
    const maxPagesAfterCurrent = 2;
  
    if (props.totalPages <= 10) {
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(currentPage.value - maxPagesBeforeCurrent, 1);
      const end = Math.min(currentPage.value + maxPagesAfterCurrent, props.totalPages);
  
      // Always show the first page if ellipsis is before it
  
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      
          // Remove leading and trailing ellipses if they are the first or last element
      if (pages[0] == '...') pages.shift();
      if (pages[pages.length - 1] == '...') pages.pop();
    }
    

  
    return pages;
  });
  
  const showLeftEllipsis = computed(() => {
    return props.totalPages > 10 && currentPage.value > 3 && props.totalPages > 3;
  });
  
  const showRightEllipsis = computed(() => {
    return props.totalPages > 10 && currentPage.value < props.totalPages - 2 && props.totalPages > 3;
  });
  
  watch(() => props.currentPage, (newPage) => {
    currentPage.value = newPage;
  });
  </script>
  
  <style scoped>
  .pagination-container {
    display: flex;
    align-items: center;
  }
  
  .pagination-button {
    padding: 5px 10px;
    margin: 0 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
  }
  
  .pagination-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  .pagination-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .pagination-item {
    margin: 0 5px;
  }
  
  .pagination-link {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
  }
  
  .pagination-link.active {
    background-color: #007bff;
    color: #fff;
    border-color: #007bff;
  }
  
  .current-page .pagination-link {
    background-color: #007bff;
    color: #fff;
  }
  
  .pagination-ellipsis {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
  }
  </style>
  