import { HstVue } from "@histoire/plugin-vue"
import { defineConfig, getDefaultConfig } from "histoire"

export default defineConfig({
  backgroundPresets: [
    ...(getDefaultConfig().backgroundPresets || []),
    {
      label: "Gray",
      color: "#cafff5",
      contrastColor: "#005142",
    },
  ],
  theme: {
    title: "Hoppscotch Design • Hoppscotch",
    logo: {
      square: "/logo.svg",
      light: "/logo.svg",
      dark: "/logo.svg",
    },
    logoHref: "/",
    favicon: "favicon.ico",
  },
  setupFile: "histoire.setup.ts",
  plugins: [HstVue()],
  viteIgnorePlugins: ["vite:dts"],
  tree: {
    groups: [
      {
        id: "top",
        title: "",
      },
      {
        id: "components",
        title: "Components",
      },
    ],
  },
})
