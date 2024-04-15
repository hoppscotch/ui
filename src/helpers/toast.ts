import { toast as soner } from "vue-sonner"

export type ToastOptions = {
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

export const toast = (message: string, option?: ToastOptions) => {
  soner(message, {
    ...option,
  })
}

/*
 * Legacy support for toast.success, toast.error, and toast.warning
 */

toast.success = (message: string, option?: ToastOptions) => {
  soner.success(message, {
    ...option,
  })
}

toast.error = (message: string, option?: ToastOptions) => {
  soner.error(message, {
    ...option,
  })
}

toast.warning = (message: string, option?: ToastOptions) => {
  soner.warning(message, {
    ...option,
  })
}
