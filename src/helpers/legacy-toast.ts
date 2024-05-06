import { defineComponent, h, markRaw } from "vue"
import { toast as sonner } from "vue-sonner"
import Toast, { LegacyToastAction } from "./../components/Toast.vue"

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
) => {
  const actions = Array.isArray(action) ? action : [action]

  return defineComponent({
    render() {
      return h(Toast, {
        message,
        actions,
      })
    },
  })
}

const addLegacyToast =
  (type?: string) => (message: string, option?: ToastOptions) => {
    // if action is an array or object with property text then it is a legacy toast
    const isLegacyToast =
      Array.isArray(option?.action) ||
      Object.prototype.hasOwnProperty.call(option?.action ?? {}, "text")

    const raw = isLegacyToast
      ? markRaw(
          generateLegacyToastWithActions(
            message,
            option?.action as LegacyToastAction, // type assertion is safe here because we checked if it is a legacy toast
          ),
        )
      : message

    const duration = option?.duration === 0 ? Infinity : option?.duration

    sonner(raw, {
      ...option,
      duration,
      action: undefined,
    })
  }

const legacyToast = Object.assign(sonner, {
  success: addLegacyToast("success"),
  error: addLegacyToast("error"),
  warning: addLegacyToast("warning"),
  show: addLegacyToast(),
})

export { legacyToast }
