<template>
  <Story title="Tab">
    <Variant title="Single">
      <HoppSmartTabs id="my-tab" v-model="selectedTab" render-inactive-tabs>
        <HoppSmartTab id="tab1" label="Tab 1">
          <h1>Tab 1 content</h1>
        </HoppSmartTab>
        <HoppSmartTab id="tab2" label="Tab 2">
          <h1>Tab 2 content</h1>
        </HoppSmartTab>
      </HoppSmartTabs>
    </Variant>

    <Variant title="Indicator variants">
      <!-- `indicator` shows the dot; `indicator-variant` picks its color. -->
      <HoppSmartTabs
        id="indicator-tabs"
        v-model="indicatorTab"
        render-inactive-tabs
      >
        <HoppSmartTab id="accent" label="Accent" indicator>
          <h1>Default (accent) dot</h1>
        </HoppSmartTab>
        <HoppSmartTab
          id="error"
          label="Error"
          indicator
          indicator-variant="error"
        >
          <h1>Error dot — flags a tab that needs attention</h1>
        </HoppSmartTab>
        <HoppSmartTab
          id="warning"
          label="Warning"
          indicator
          indicator-variant="warning"
        >
          <h1>Warning dot</h1>
        </HoppSmartTab>
        <HoppSmartTab
          id="success"
          label="Success"
          indicator
          indicator-variant="success"
        >
          <h1>Success dot</h1>
        </HoppSmartTab>
        <HoppSmartTab id="info" label="Info" indicator indicator-variant="info">
          <h1>Info dot</h1>
        </HoppSmartTab>
      </HoppSmartTabs>
    </Variant>

    <Variant title="Ordered">
      <!--
        Declared out of order but carrying `order` hints, so they render
        First / Second / Third. The optional "Pinned" tab toggles via `v-if`
        yet always lands in slot 2 regardless of mount time — the use case
        `order` exists for.
      -->
      <button @click="showPinned = !showPinned">
        {{ showPinned ? "Hide pinned tab" : "Show pinned tab" }}
      </button>
      <HoppSmartTabs id="ordered-tabs" v-model="orderedTab" render-inactive-tabs>
        <HoppSmartTab id="third" label="Third" :order="3">
          <h1>Third content</h1>
        </HoppSmartTab>
        <HoppSmartTab id="first" label="First" :order="1">
          <h1>First content</h1>
        </HoppSmartTab>
        <HoppSmartTab
          v-if="showPinned"
          id="pinned"
          label="Pinned (order 2)"
          :order="2"
        >
          <h1>Pinned content</h1>
        </HoppSmartTab>
      </HoppSmartTabs>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { HoppSmartTabs, HoppSmartTab } from "../components/smart"
import { ref } from "vue"

const selectedTab = ref("tab1")
const indicatorTab = ref("error")
const orderedTab = ref("first")
const showPinned = ref(false)
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
