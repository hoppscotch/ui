import { toast as sonner, ToasterProps } from "vue-sonner"

export type ToastOptions = {
  type?: "success" | "error" | "warning" | "info"
  duration?: number
} & ToasterProps["toastOptions"]

export const toast = (message: string, option?: ToastOptions) => {
  sonner(message, {
    ...option,
  })
}

/*
 * Legacy support for toast.success, toast.error, and toast.warning
 */

toast.success = (message: string, option?: ToastOptions) => {
  sonner.success(message, {
    ...option,
  })
}

toast.error = (message: string, option?: ToastOptions) => {
  sonner.error(message, {
    ...option,
  })
}

toast.warning = (message: string, option?: ToastOptions) => {
  sonner.warning(message, {
    ...option,
  })
}

toast.show = toast
