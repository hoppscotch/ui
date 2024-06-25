import { defineComponent, h, markRaw } from "vue"
import { toast as sonner } from "@hoppscotch/vue-sonner"
import Toast, { LegacyToastAction } from "./Toast.vue"

export type ToastOptions = {
  duration?: number
  closeOnSwipe?: boolean
  action?: LegacyToastAction | LegacyToastAction[]
}

/*
 * Legacy support for toast.success, toast.error, and toast.warning
 */

const generateLegacyToastWithActions = (
  message: string,
  action: LegacyToastAction | LegacyToastAction[],
  toastId: number,
) => {
  const actions = Array.isArray(action) ? action : [action]

  return defineComponent({
    render() {
      return h(Toast, {
        message,
        actions,
        onCloseToast: (delay?: number) => {
          if (delay !== undefined) {
            setTimeout(() => {
              sonner.dismiss(toastId)
            }, delay)
          } else {
            sonner.dismiss(toastId)
          }
        },
      })
    },
  })
}

let toastIDTicker = 0

const addLegacyToast =
  (type?: string) => (message: string, option?: ToastOptions) => {
    // if action is an array or object with property text then it is a legacy toast
    const isLegacyToast =
      Array.isArray(option?.action) ||
      Object.prototype.hasOwnProperty.call(option?.action ?? {}, "text")

    toastIDTicker++
    const toastID = toastIDTicker

    const raw = isLegacyToast
      ? markRaw(
          generateLegacyToastWithActions(
            message,
            option?.action as LegacyToastAction, // type assertion is safe here because we checked if it is a legacy toast
            toastID,
          ),
        )
      : message

    const duration = option?.duration === 0 ? Infinity : option?.duration

    sonner(raw, {
      ...option,
      duration,
      action: undefined,
      id: toastID,
      classes: {
        toast: "legacy-toast",
      },
    })
  }

/**
 * @deprecated LegacyToast is deprecated and will be removed in a future version. Not recommended for use. Instead import toast from '@hoppscotch/ui' and use 'toast.show()'
 */
const legacyToast = {
  success: addLegacyToast("success"),
  error: addLegacyToast("error"),
  warning: addLegacyToast("warning"),
  show: addLegacyToast(),
}

export { legacyToast }
