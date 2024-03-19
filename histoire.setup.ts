import { defineSetupVue3 } from "@histoire/plugin-vue"
import { plugin as VuePromiseModals } from "vue-promise-modals"

import GlobalWrapper from "./src/GlobalWrapper.vue"

import "./src/assets/scss/histoire.scss"

import "@fontsource-variable/inter"
import "@fontsource-variable/material-symbols-rounded"
import "@fontsource-variable/roboto-mono"

export const setupVue3 = defineSetupVue3(({ app, addWrapper }) => {
  app.use(VuePromiseModals, {})
  addWrapper(GlobalWrapper)
})
