<template>
  <Story title="Toast (Legacy)">
    <button @click="launchLegacyToast">Simple Legacy toast</button>
    <button @click="openLegacyToastWithAction">Open Toast with Action</button>
    <button @click="openLegacyToastWithMultiActions">
      Open Toast with Multiple Actions
    </button>
  </Story>
</template>

<script lang="ts" setup>
import { legacyToast as toast } from "./../components/toast"

const launchLegacyToast = () => {
  toast.success("Simple Legacy toast")
}

const openLegacyToastWithAction = () => {
  toast.show(
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe perspiciatis, explicabo tempore sint ex, ducimus perferendis numquam dicta doloremque quaerat neque hic illo eius iste exercitationem praesentium debitis atque quae?`,
    {
      duration: 0,
      action: {
        text: `Yes`,
        onClick: (e, obj) => {
          console.log(e)
        },
      },
    },
  )
}

const openLegacyToastWithMultiActions = () => {
  toast.show(`Are you sure?`, {
    duration: 0,
    action: [
      {
        text: `Dismiss`,
        onClick: (_, toastObject) => {
          toastObject?.goAway()
        },
      },
      {
        text: `Confirm`,
        onClick: (_, toastObject) => {
          alert("Confirmed")
        },
      },
    ],
  })
}
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5f5f5;
  cursor: pointer;
  color: #333;
}
</style>
