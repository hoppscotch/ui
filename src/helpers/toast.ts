import { defineComponent, h, markRaw } from "vue"
import { toast as sonner } from "vue-sonner"

export type SonnerToastOptions = Exclude<
  Parameters<typeof sonner>[1],
  undefined
>

export type LegacyToastAction = {
  text: string
  onClick: (event: MouseEvent, toast: unknown) => void
}

export type ToastOptions = {
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  closeOnSwipe?: boolean
  action?:
    | LegacyToastAction
    | LegacyToastAction[]
    | SonnerToastOptions["action"]
} & SonnerToastOptions

export const toast = (
  message: Parameters<typeof sonner>[0], // string | Component
  option?: ToastOptions,
) => {
  sonner(message, option)
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
    setup() {
      return () =>
        h(
          "div",
          {
            class: "l-toast",
          },
          [
            h(
              "div",
              {
                class: "l-toast-title",
              },
              message,
            ),
            h(
              "div",
              {
                class: "l-toast-actions",
              },
              actions.map((action) =>
                h(
                  "button",
                  {
                    onClick: (e: MouseEvent) => {
                      action?.onClick(e, {
                        goAway: (delay?: number) => {},
                      })
                    },
                  },
                  action.text,
                ),
              ),
            ),
          ],
        )
    },
  })
}

const legacyToast =
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
      // @ts-ignore type is not compatible with legacy toast
      type,
      duration,
      action: isLegacyToast ? undefined : option?.action,
    })
  }

toast.success = legacyToast("success")
toast.error = legacyToast("error")
toast.warning = legacyToast("warning")
toast.show = legacyToast()
