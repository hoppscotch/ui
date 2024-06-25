import { defineSetupVue3 } from "@histoire/plugin-vue"
import { plugin } from "vue-promise-modals"

import GlobalWrapper from "./src/GlobalWrapper.vue"

import "./src/assets/scss/themes.scss"
import "./src/assets/scss/styles.scss"

import "@fontsource-variable/inter"
import "@fontsource-variable/material-symbols-rounded"
import "@fontsource-variable/roboto-mono"

export const setupVue3 = defineSetupVue3(({ app, addWrapper }) => {
  app.use(plugin, {})
  addWrapper(GlobalWrapper)
})
