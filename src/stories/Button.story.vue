<template>
  <Story title="Button">
    <Variant title="Primary">
      <HoppButtonPrimary 
        ref="primaryButton"
        label="Button" 
        @click="handleClick('Primary button clicked')" 
      />
    </Variant>
    <Variant title="Secondary">
      <HoppButtonSecondary 
        label="Button" 
        :loading="isLoading"
        @click="handleClick('Secondary button clicked')" 
      />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { HoppButtonPrimary, HoppButtonSecondary } from "../components/button"

const primaryButton = ref<InstanceType<typeof HoppButtonPrimary> | null>(null);
const isLoading = ref(false);

// Function to handle click event, log message, and trigger an Enter keypress event
function handleClick(message: string) {
  console.log(message)

    // Set loading state to true
  isLoading.value = true;

  // Simulate loading by resetting the loading state after 3 seconds
  setTimeout(() => {
  isLoading.value = false;
}, 3000); // 3 seconds delay
}

function handleKeyPress(event: KeyboardEvent) {

  const enterEvent = new KeyboardEvent('keydown', {
    key: ' ',
    code: ' ',
    keyCode: 32, 
    charCode: 32,
    which: 32,
    bubbles: true, 
  });

  // Dispatch the Enter keypress event on the HoppButtonPrimary element
  if (primaryButton.value) {
    primaryButton.value.$el.dispatchEvent(enterEvent); // Trigger the event on the button
  }
}

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleKeyPress(event);
    }
  });
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress)
})

</script>
