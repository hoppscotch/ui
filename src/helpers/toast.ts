import { toast as soner } from "vue-sonner"

type ToastOptions = {
  type: "success" | "error" | "warning" | "info"
  duration: number
}

export const toast = (message: string, option?: ToastOptions) => {
  console.log("toast")
  soner(message, {
    ...option,
  })
}
